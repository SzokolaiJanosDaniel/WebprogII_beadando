export function ensureLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  req.flash('error','Kérjük, jelentkezz be!');
  res.redirect('/auth/login');
}
export function ensureRole(role){
  return (req,res,next)=>{
    if(req.isAuthenticated() && (req.user.role===role || req.user.role==='admin')) return next();
    req.flash('error','Nincs jogosultságod.');
    res.redirect('/');
  };
}
