const express = require('express');
const path = require('path');
const captchaUtil = require('../utils/captcha');

const router = express.Router();

// Render login page
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Simple login handler - accepts any credentials for demo purposes
router.post('/login', (req, res) => {
    const { application_no, password, captcha } = req.body;

    if (!application_no || !password || !captcha) {
        return res.render('login', { error: 'All fields are required.' });
    }

    if (!req.session.captcha || captcha.trim().toLowerCase() !== req.session.captcha.toLowerCase()) {
        return res.render('login', { error: 'Invalid security pin. Please try again.' });
    }

    // In a real app validate application_no/password against a database or file.
    req.session.student = {
        application_no: application_no,
        name: 'Student ' + application_no,
    };
    req.session.isAdmin = false;

    return res.redirect('/student');
});

router.get('/captcha', (req, res) => {
    const { svg, text } = captchaUtil.generate(5);
    req.session.captcha = text;
    res.type('image/svg+xml').send(svg);
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/login');
    });
});

module.exports = router;