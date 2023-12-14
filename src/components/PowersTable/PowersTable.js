
function SignedValue({ value }) {
  if (value >= 0) {
    return (
      <>+{value}</>
    );
  }

  return (
    <>&minus;{-value}</>
  );
}

function PowersTableRow({ particleColor, rowPowers}) {
  const tableDataStyle = {
    border: "1px solid black",
  };

  return (
    <>
      <tr>
        <td style={tableDataStyle}> <span style={{color: particleColor, fontSize: 'xx-large'}}>&#9679;</span> </td>
        <td style={tableDataStyle}> <SignedValue value={rowPowers['red']}/> </td>
        <td style={tableDataStyle}> <SignedValue value={rowPowers['green']}/> </td>
        <td style={tableDataStyle}> <SignedValue value={rowPowers['blue']}/> </td>
      </tr>
    </>
  );
}

export function PowersTable({ powers }) {
  const tableStyle = {
    border: "1px solid black",
    padding: "8px",
    margin: "2px",
    width: "100%",
    textAlign: "center",
    borderCollapse: "collapse"
  };

  const tableDataStyle = {
    border: "1px solid black",
  };

  return (
    <>
      <h3 style={{textAlign: "center"}}>Силы взаимодействия</h3>
      <table style={tableStyle}>
        <tr>
          <td style={tableDataStyle}></td>
          <td style={tableDataStyle}> <span style={{color: 'red', fontSize: 'xx-large'}}>&#9679;</span> </td>
          <td style={tableDataStyle}> <span style={{color: 'green', fontSize: 'xx-large'}}>&#9679;</span> </td>
          <td style={tableDataStyle}> <span style={{color: 'blue', fontSize: 'xx-large'}}>&#9679;</span> </td>
        </tr>
        <PowersTableRow particleColor={'red'} rowPowers={powers['red']}/>
        <PowersTableRow particleColor={'green'} rowPowers={powers['green']}/>
        <PowersTableRow particleColor={'blue'} rowPowers={powers['blue']}/>
      </table>
    </>
  );
}
