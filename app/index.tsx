// // app/index.tsx

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/login" />;
}
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import Login from './login';
// import SignUp from './signup';

// export default function Index() {
//   const router = useRouter();
//   const [mode, setMode] = useState<'login'|'signup'>('login');

//   const onSuccess = () => {
//     router.push('/(tabs)/map');
//   };

//   return mode === 'login' ? (
//     <Login  onLogin={onSuccess}    onGoToSignUp={() => setMode('signup')} />
//   ) : (
//     <SignUp onSignUp={onSuccess}   onGoToLogin={()    => setMode('login')}  />
//   );
// }
