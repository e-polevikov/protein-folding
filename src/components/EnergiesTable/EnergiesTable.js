import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export function EnergiesTable({ energies }) {
  const initialEnergyLatex = "$E_{init}$";
  const currentEnergyLatex = "$E_{curr}$";
  const minimalEnergyLatex = "$E_{min}$";

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
    fontSize: "20px"
  };

  return (
    <div style={{paddingBottom: "6px"}}>
      <h3 style={{textAlign: "center", fontSize: "28px"}}> Энергия </h3>
      <table style={tableStyle}>
        <tbody>
          <tr>
            <th style={tableDataStyle}><Latex>{initialEnergyLatex}</Latex></th>
            <th style={tableDataStyle}><Latex>{currentEnergyLatex}</Latex></th>
            <th style={tableDataStyle}><Latex>{minimalEnergyLatex}</Latex></th>
          </tr>
          <tr>
            <td style={tableDataStyle}> {energies.initial.toFixed(3)} </td>
            <td style={tableDataStyle}> {energies.current.toFixed(3)} </td>
            <td style={tableDataStyle}> {energies.minimal.toFixed(3)} </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
