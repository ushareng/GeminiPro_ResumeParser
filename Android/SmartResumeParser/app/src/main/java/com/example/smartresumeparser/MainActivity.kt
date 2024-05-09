package com.example.smartresumeparser

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.smartresumeparser.ui.theme.SmartResumeParserTheme

class MainActivity : ComponentActivity() {

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SmartResumeParserTheme {
                Scaffold(topBar = {
                    TopAppBar(
                        colors = TopAppBarDefaults.smallTopAppBarColors(
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            titleContentColor = MaterialTheme.colorScheme.primary,
                        ),
                        title = {
                            Text("Smart Resume Parser")
                        }
                    )
                }) { contentPadding ->
                    val navController = rememberNavController()

                    NavHost(navController = navController, startDestination = "home") {
                        composable(route = "home") {
                            HomeScreen(navController, contentPadding,this@MainActivity)
                        }
                        composable(route = "result/{result}") { backStackEntry ->
                            ResultScreen(backStackEntry.arguments?.getString("result")!!,contentPadding)}
                    }

                }
            }

        }
    }
}
