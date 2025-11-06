export default function Offline() {
  return (
    <div className="wrapper notfound">
      <h3>You appear to be offline</h3>
      <p className="notfoundBody">
        We couldn’t sync new data without a connection. Once you are back online, reload the page to resume.
      </p>
      <button
        type="button"
        className="notfoundPrimary"
        onClick={() => window.location.reload()}
      >
        Retry connection
      </button>
    </div>
  )
}
