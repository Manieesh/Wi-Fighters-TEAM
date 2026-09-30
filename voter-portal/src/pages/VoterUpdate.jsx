import { useState } from 'react'

function VoterUpdate() {
  const [formData, setFormData] = useState({
    voterId: '',
    name: '',
    address: '',
    mobile: '',
    constituency: '',
  })
  const [updated, setUpdated] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setUpdated(true)
  }

  return (
    <main className="page-shell">
      <div className="container voter-shell">
        <div className="voter-form-card update-card">
          <div className="section-heading left compact-heading">
            <span className="section-kicker">Update Details</span>
            <h2>Update Voter Details</h2>
          </div>

          {!updated ? (
            <form className="gov-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="voterId">Application/Voter ID</label>
                  <input id="voterId" name="voterId" value={formData.voterId} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-field full-width">
                  <label htmlFor="address">Address</label>
                  <input id="address" name="address" value={formData.address} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="mobile">Mobile Number</label>
                  <input id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="constituency">Constituency</label>
                  <input id="constituency" name="constituency" value={formData.constituency} onChange={handleChange} />
                </div>
              </div>

              <div className="button-row">
                <button type="submit" className="primary-btn">Update Details</button>
              </div>
            </form>
          ) : (
            <div className="submission-success simple-success">
              <h3>Details Updated Successfully</h3>
              <p>Your voter details were updated in this demo workflow.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default VoterUpdate
