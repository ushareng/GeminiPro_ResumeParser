package com.example.smartresumeparser

import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.Part
import retrofit2.http.Path

interface RetrofitApi {

    @Multipart
    @POST("resume_parser/") // Replace with your actual API endpoint
    fun uploadResume(@Part file: MultipartBody.Part): Call<String>

}