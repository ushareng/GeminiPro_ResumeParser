import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:file_picker/file_picker.dart';
import 'package:dio/dio.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Resume Parser',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _jobDescController = TextEditingController();
  String? _filePath;
  bool _isLoading = false;
  String _result = '';

  void _pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(type: FileType.custom, allowedExtensions: ['pdf']);
    if (result != null) {
      setState(() {
        _filePath = result.files.single.path;
      });
    }
  }

  void _submit() async {
    if (_filePath != null) {
      setState(() {
        _isLoading = true;
      });

      String fileName = _filePath!.split('/').last;
      FormData formData = FormData.fromMap({
        "file": await MultipartFile.fromFile(_filePath!, filename: fileName),
      });

      Dio dio = Dio();
      try {
        Response response =
            await dio.post('https://tensorgirl-gemini-resume-parser.hf.space/resume_parser/', data: formData);
        setState(() {
          _result = response.data.toString();
        });
      } catch (e) {
        print('Upload failed: $e');
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Please select a file")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.purple[200],
        title: const Text('Smart Resume Parser'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            children: [
              TextField(
                controller: _jobDescController,
                decoration: const InputDecoration(labelText: 'Job Description'),
                textInputAction: TextInputAction.done,
                onSubmitted: (_) {
                  SystemChannels.textInput.invokeMethod('TextInput.hide');
                },
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  ElevatedButton(
                    onPressed: _pickFile,
                    child: const Text('Select file'),
                  ),
                  const SizedBox(width: 16),
                  Text(_filePath != null ? 'File selected' : 'No file selected'),
                ],
              ),
              const SizedBox(height: 16),
              _isLoading
                  ? const CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _submit,
                      child: const Text('Submit'),
                    ),
              const SizedBox(height: 16),
              _result.isNotEmpty ? Text('Result: $_result') : Container(),
            ],
          ),
        ),
      ),
    );
  }
}
