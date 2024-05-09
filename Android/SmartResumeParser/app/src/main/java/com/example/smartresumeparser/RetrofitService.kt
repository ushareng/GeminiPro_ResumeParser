package com.example.smartresumeparser

import com.google.gson.GsonBuilder
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.File


object RetrofitService {
    private const val BASE_URL = "https://tensorgirl-gemini-resume-parser.hf.space/"

    var gson = GsonBuilder()
        .setLenient()
        .create()

    private fun getRetrofit(baseUrl: String) =
        Retrofit.Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()

    val retrofitApi = getRetrofit(BASE_URL).create(RetrofitApi::class.java)


}