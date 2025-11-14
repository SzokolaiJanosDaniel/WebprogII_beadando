import { Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { User } from '../models/index.js';

const router = Router();

router.get('/register', (req,res)=> res.render('auth/register'));
router.post('/register', async (req,res)=>{
  const { email, password } = req.body;
  if(!email || !password){ req.flash('error','Hinyázó adatok'); return res.redirect('/auth/register'); }
  try{
    const hash = await bcrypt.hash(password,10);
    await User.create({ email, passwordHash: hash });
    req.flash('success','Sikeres regisztráció! Jelentkezz be.');
    res.redirect('/auth/login');
  }catch(e){
    req.flash('error','Hiba: '+e.message); res.redirect('/auth/register');
  }
});

router.get('/login', (req,res)=> res.render('auth/login'));
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

router.post('/logout',(req,res,next)=>{
  req.logout(err=>{
    if(err) return next(err);
    req.flash('success','Kijelentkeztél.');
    res.redirect('/');
  });
});

export default router;
