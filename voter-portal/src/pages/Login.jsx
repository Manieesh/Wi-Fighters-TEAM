import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'

function Login() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    if (mobile && password) {
      setMessage('Demo login successful')
      setTimeout(() => navigate('/dashboard'), 500)
    } else {
      setMessage('Enter any demo mobile number and password to continue.')
    }
  }

  return (
    <main className="page-shell">
      <Breadcrumbs items={[{ label: 'Demo Login' }]} />
      <div className="container login-wrap">
        <div className="simple-page login-card">
          <span className="section-kicker">Prototype Access</span>
          <h1>Demo Login</h1>
          <p className="page-intro">This is a frontend-only demo login. No real authentication is performed.</p>
          <form className="gov-form" onSubmit={handleLogin}>
            <div className="form-field"><label htmlFor="login-mobile">Mobile Number</label><input id="login-mobile" value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="Enter demo mobile number" /></div>
            <div className="form-field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter demo password" /></div>
            {message && <div className="demo-action-message">{message}</div>}
            <div className="button-row"><button type="submit" className="primary-btn"><LogIn size={16} /> Login</button><button type="button" className="secondary-btn dark-btn" onClick={() => setMessage('Demo account creation is available for presentation only.')}>Create Account</button></div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login
