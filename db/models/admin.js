    const { Schema, model } = require('mongoose');

    const adminSchema = new Schema({
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: 5,
            trim: true
        },
        password: {
            type: String,
            required: true
        },

    });

    const Admin = model('admin', adminSchema);

    module.exports = Admin;