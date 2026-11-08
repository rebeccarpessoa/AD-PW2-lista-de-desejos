import imageUdesc from "../../public/image.png"
import './About.css'


export function About(){


   return (
      <div className="aboutContainer">
         {/* <h2>Sobre a equipe</h2> */}

         <div className="divImage">
            <img src={imageUdesc} alt="Imagem da Faculdade UDESC"/>
         </div>
         
         <p>
            Programação Web II (UDESC)
         </p>

         <p>
            Aluna: Rebecca Repsold Pessoa
         </p>
      </div>
   )
}