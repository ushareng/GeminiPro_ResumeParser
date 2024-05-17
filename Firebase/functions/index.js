/**
 * Parses a 'multipart/form-data' upload request
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
const path = require('path');
const os = require('os');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const functions = require('firebase-functions');

// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.
const Busboy = require('busboy');

exports.resumeParser =  functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') {
    // Return a "method not allowed" errors
    return res.status(405).end();
  }
  const busboy = Busboy({headers: req.headers});
  const tmpdir = os.tmpdir();

  // This object will accumulate all the fields, keyed by their name
  const fields = {};

  // This object will accumulate all the uploaded files, keyed by their name.
  const uploads = {};

  // This code will process each non-file field in the form.
  busboy.on('field', (fieldname, val) => {
    /**
     *  TODO(developer): Process submitted field values here
     */
    console.log(`Processed field ${fieldname}: ${val}.`);
    fields[fieldname] = val;
  });

  const fileWrites = [];

  // This code will process each file uploaded.
  busboy.on('file', (fieldname, file, {filename}) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    console.log(`Processed file ${filename}`);
    const filepath = path.join(tmpdir, filename);
    uploads[fieldname] = filepath;

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    // File was processed by Busboy; wait for it to be written.
    // Note: GCF may not persist saved files across invocations.
    // Persistent files must be kept in other locations
    // (such as Cloud Storage buckets).

    const promise = new Promise((resolve, reject) => {
        file.on('end', () => writeStream.end());
        writeStream.on('close', () => resolve({ fieldname, filepath }));
        writeStream.on('error', reject);
      });
    fileWrites.push(promise);
  });

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  busboy.on('finish', async () => {
    await Promise.all(fileWrites);
    let result = '';
    /**
     * TODO(developer): Process saved files here
     */
    for (const fileKey in uploads) {
        const formData = new FormData();
        formData.append(fileKey, fs.createReadStream(uploads[fileKey])); // corrected path usage here
        try {
            const response = await axios.post('https://tensorgirl-gemini-resume-parser.hf.space/resume_parser/', formData, {
            //   headers: formData.getHeaders(),
            });
            if(response.status === 200){
                result = response.data;
                console.log(result, 'result');
               return res.send(result);
            } else {
               return  res.status(response.status).send("Error processing file.");
            }
          } catch (error) {
            console.error('Failed to send file:', error);
            res.status(500).send("Internal server error");
          } finally {
            fs.unlinkSync(uploads[fileKey]); // make sure to delete the file using the correct reference
          }
      }
    res.send("Hey");
    // return res.send(result);
  });
  busboy.end(req.rawBody);
});
