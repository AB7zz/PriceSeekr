import "~base.css"
import "~style.css"
import { MySearchProvider } from "~context/SearchContext"
import Main from "~main";

function IndexPopup() {
  return (
    <>
      <MySearchProvider>
        <Main />
      </MySearchProvider>
    </>
  );
}

export default IndexPopup