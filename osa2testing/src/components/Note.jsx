const Note = ({content, toggleImportance, important}) => {
  const buttonLabel = important ? "make unimportant" : "make important"
  return (
    <li>
      {content}
      <button onClick={toggleImportance}>{buttonLabel}</button>
    </li>
  )
}

export default Note