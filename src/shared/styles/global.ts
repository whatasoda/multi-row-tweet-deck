import { createGlobalStyle } from 'styled-components';
import { ROOT_SELECTOR } from '../constants';

const GlobalStyle = createGlobalStyle`
  ${ROOT_SELECTOR} {
      .column-drag-handle {
        visibility: hidden;
      }

      .app-columns {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: flex-start;
      }

      .wide {
        .compose-account {
          margin-right: 16px;
        }

        .is-minigrid {
          .compose-account {
            margin-right: 9px;
          }
        }
      }

      .compose-account {
        margin-right: 16px;
      }
      
      .is-minigrid {
        .compose-account {
          margin-right: 9px;
        }
      }
    }
`;

export default GlobalStyle;
