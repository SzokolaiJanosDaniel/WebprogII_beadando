import express from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import morgan from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
import { fileURLToPath } from 'url';
dotenv.config();

import './config/passport.js';
import { sequelize } from './models/index.js';

import mainRoutes from './routes/main.js';
import authRoutes from './routes/auth.js';
import szereloRoutes from './routes/szerelo.js';
import munkalapRoutes from './routes/munkalap.js';
import messageRoutes from './routes/messages.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(session({ secret: process.env.SESSION_SECRET || 'valami-titok', resave:false, saveUninitialized:false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
});

app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/szerelok', szereloRoutes);
app.use('/munkalapok', munkalapRoutes);
app.use('/messages', messageRoutes);
app.use('/admin', adminRoutes);

app.get('/health', async (req,res)=>{
  try { await sequelize.authenticate(); res.json({status:'ok'}); }
  catch(e){ res.status(500).json({status:'db_error', message:e.message}); }
});

export default app;
