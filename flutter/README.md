Sure, here is a detailed `README.md` markdown code for the provided Flutter implementation:

```markdown
# Smart Resume Parser

Smart Resume Parser is a Flutter application that allows users to input a job description, select a resume file (PDF), and upload it to a server for parsing. The server returns the parsed result, which is then displayed on the app.

## Features

- Input a job description
- Select a resume file (PDF)
- Upload the selected file to a server
- Display the parsed result from the server

## Getting Started

These instructions will help you set up and run the Smart Resume Parser application on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

- Flutter SDK: [Flutter Installation](https://flutter.dev/docs/get-started/install)
- Dart SDK: Included with Flutter
- Android Studio or Visual Studio Code with Flutter extension

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/smart-resume-parser.git
    cd smart-resume-parser
    ```

2. **Install dependencies:**

    ```bash
    flutter pub get
    ```

3. **Run the application:**

    ```bash
    flutter run
    ```

### Project Structure

```
smart-resume-parser/
│
├── android/                # Android-specific files
├── ios/                    # iOS-specific files
├── lib/                    # Main source code
│   ├── main.dart           # Entry point of the application
│
├── test/                   # Unit and widget tests
│
├── pubspec.yaml            # Project dependencies
├── README.md               # Project README
└── .gitignore              # Files to ignore in version control
```

### Dependencies

The project uses the following dependencies:

- [file_picker](https://pub.dev/packages/file_picker): A package to pick files from the file system.
- [dio](https://pub.dev/packages/dio): A powerful HTTP client for Dart, used for making network requests.

Add these dependencies to your `pubspec.yaml` file:

```yaml
dependencies:
  flutter:
    sdk: flutter
  file_picker: ^5.0.1
  dio: ^5.0.0
```

### Implementation Details

1. **File Selection:**

    The app uses the `file_picker` package to allow users to select a PDF file from their device:

    ```dart
    FilePickerResult? result = await FilePicker.platform.pickFiles(type: FileType.custom, allowedExtensions: ['pdf']);
    ```

2. **File Upload:**

    The selected file is uploaded to the server using the `dio` package:

    ```dart
    FormData formData = FormData.fromMap({
      "file": await MultipartFile.fromFile(_filePath!, filename: fileName),
    });

    Dio dio = Dio();
    Response response = await dio.post('https://tensorgirl-gemini-resume-parser.hf.space/resume_parser/', data: formData);
    ```

3. **Displaying Result:**

    The server's response is displayed on the app:

    ```dart
    setState(() {
      _result = response.data;
    });
    ```

### Usage

1. **Enter a Job Description:**

    Enter the job description in the provided text field.

2. **Select a Resume File:**

    Click on the "Select file" button to choose a PDF file from your device.

3. **Upload the File:**

    Click on the "Submit" button to upload the selected file to the server. The parsed result will be displayed on the screen.

### Demo



![Demo Video](/Flutter/geminipro_resumeparser/demo/demo.gif)

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.


### Contributor and Developer

[Gayathri Devi Srinivasan](https://www.linkedin.com/in/gayathri-devi-srinivasan-961bbb147/).

