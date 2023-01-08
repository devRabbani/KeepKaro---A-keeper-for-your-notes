export default function Share() {
  const parsedUrl = new URL(window.location.toString())
  const title = parsedUrl.searchParams.get('title')
  const text = parsedUrl.searchParams.get('text')
  const url = parsedUrl.searchParams.get('url')
  return (
    <>
      <h1>This is SHar</h1>
      <p>Title : {title}</p>
      <p>Text : {text}</p>
      <p>Url : {url}</p>
    </>
  )
}
