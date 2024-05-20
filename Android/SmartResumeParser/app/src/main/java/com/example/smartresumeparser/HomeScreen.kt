package com.example.smartresumeparser


import android.app.Activity
import android.content.Context
import android.net.Uri
import android.provider.OpenableColumns
import android.util.Log
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.focus.FocusManager
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.tom_roush.pdfbox.io.IOUtils
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream

const val TAG = "HomeScreen"

@OptIn(ExperimentalMaterial3Api::class, ExperimentalComposeUiApi::class)
@Composable
fun HomeScreen(
    navController: NavHostController,
    contentPadding: PaddingValues,
    activity: Activity
) {

    var jobDesc by remember { mutableStateOf("") }
    var isVisible by remember { mutableStateOf(false) }
    var fileUri by remember { mutableStateOf<Uri?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    val keyboardController = LocalSoftwareKeyboardController.current


    val pickFileLauncher =
        rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
            uri?.let {
                fileUri = uri // Store the URI in your variable (e.g., fileUri)
                isVisible = true
            }
        }


    Box(Modifier.padding(8.dp)) {
        ProgressBar(isLoading)
        Column(modifier = Modifier.padding(contentPadding)) {

            Row {
                Text(
                    text = "Job Description",
                    modifier = Modifier
                        .align(Alignment.CenterVertically)
                        .padding(end = 8.dp)
                )
                OutlinedTextField(value = jobDesc, onValueChange = { jobDesc = it }, keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(
                        onDone = {keyboardController?.hide()}))
            }

            Row(Modifier.padding(vertical = 8.dp)) {
                Text(
                    text = "Resume",
                    modifier = Modifier
                        .align(Alignment.CenterVertically)
                        .padding(end = 8.dp)
                )
                Button(onClick = {
                    pickFileLauncher.launch("application/pdf")
                }, modifier = Modifier.align(Alignment.CenterVertically)) {
                    Text("Select file")
                }
            }

            if (isVisible) {
                Text("File Uploaded successfully!", Modifier.padding(vertical = 8.dp))
            }

            Button(
                onClick = {

                    if(fileUri!=null) {
                        isLoading = true
                        val parcelFileDescriptor =
                            activity.contentResolver.openFileDescriptor(fileUri!!, "r", null)

                        parcelFileDescriptor?.let {
                            val inputStream = FileInputStream(parcelFileDescriptor.fileDescriptor)
                            val file =
                                File(activity.cacheDir, getFileNameFromUri(activity, fileUri!!)!!)
                            val outputStream = FileOutputStream(file)
                            IOUtils.copy(inputStream, outputStream)
                            uploadFile(file, navController) {
                                isLoading = !isLoading
                            }

                            parcelFileDescriptor.close()
                        }
                    }else{
                        Toast.makeText(activity,"Please select a file",Toast.LENGTH_LONG).show()
                    }


                },

                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .fillMaxWidth()
                    .padding(top = 16.dp)
            ) {
                Text("Submit")
            }
        }
    }
}

fun getFileNameFromUri(context: Context, uri: Uri): String? {
    val fileName: String?
    val cursor = context.contentResolver.query(uri, null, null, null, null)
    cursor?.moveToFirst()
    fileName = cursor?.getString(cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME))
    cursor?.close()
    return fileName
}

fun uploadFile(
    selectedFile: File,
    navController: NavHostController,
    triggerIsLoading: () -> Unit,
) {

    val fileRequestBody = RequestBody.create(MediaType.parse("text/plain"), selectedFile)
    val filePart = MultipartBody.Part.createFormData("file", selectedFile.name, fileRequestBody)

    val call = RetrofitService.retrofitApi.uploadResume(filePart)
    call.enqueue(object : retrofit2.Callback<String> {
        override fun onResponse(call: Call<String>, response: retrofit2.Response<String>) {
            if (response.isSuccessful) {
                val apiResponse = response.body()
                navController.navigate("result/$apiResponse")
            } else {
                Log.d(TAG, "response code:" + response.code())
            }
            triggerIsLoading()

        }

        override fun onFailure(call: Call<String>, t: Throwable) {
            Log.e(TAG, "OnFailure:" + t.message)
            triggerIsLoading()
        }
    })
}

@Composable
fun ProgressBar(isLoading: Boolean) {

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(
            modifier = Modifier
                .size(40.dp)
                .alpha(if (isLoading) 1f else 0f)
                .align(Alignment.Center),
            color = MaterialTheme.colorScheme.primary,
            strokeWidth = 3.dp
        )
    }
}

