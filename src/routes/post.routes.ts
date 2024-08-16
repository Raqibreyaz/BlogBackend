import express from "express";

const Router = express.Router()

Router.route('/create-post')
Router.route('/update-post/:id')
Router.route('/get-posts')
Router.route('/get-post/:id')
Router.route('/delete-post/:id')

export default Router