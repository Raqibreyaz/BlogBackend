import express from "express";

const Router = express.Router()

Router.route('/create-comment')
Router.route('/update-comment')
Router.route('/get-comments')
Router.route('/delete-comment')

export default Router