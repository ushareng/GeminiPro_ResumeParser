import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gemini Pro Resume Parser',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final GeminiService geminiService = GeminiService();
  String response = '';

  void _getGeminiResponse() async {
    String resumeText = 'Your resume text'; // You need to get the resume text from somewhere
    String jobDescription = 'Machine Learning Engineer'; // Your job description
    String geminiResponse = await geminiService.getResponse(resumeText, jobDescription);
    setState(() {
      response = geminiResponse;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gemini App'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: _getGeminiResponse,
              child: const Text('Get Gemini Response'),
            ),
            const SizedBox(height: 20),
            Text(response),
          ],
        ),
      ),
    );
  }
}

class GeminiService {
  static const String apiUrl = 'https://api.wandb.ai';

  Future<String> getResponse(String resumeText, String jobDescription) async {
    String apiKey = 'WRITE_YOUR_WANDB_API_KEY';
    String modelId = 'gemini-pro';
    String inputPrompt = '''
    Hey Act Like a skilled or very experience ATS(Application Tracking System)
    with a deep understanding of tech field,software engineering,data science ,data analyst
    and big data engineer. Your task is to evaluate the resume based on the given job description.
    You must consider the job market is very competitive and you should provide
    best assistance for improving thr resumes. Assign the percentage Matching based
    on Jd and
    the missing keywords with high accuracy
    resume: $resumeText
    description: $jobDescription
    I want the response as per below structure
    {"JD Match": "%",
    "MissingKeywords": [],
    "Profile Summary": ""}
    ''';

    var response = await http.post(
      Uri.parse('$apiUrl/models/$modelId/generateContent'),
      headers: {
        'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'input': inputPrompt}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['text'];
    } else {
      throw Exception('Failed to load response');
    }
  }
}
