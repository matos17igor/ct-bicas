import { useNavigate } from "react-router-dom";
import logoCt from "../assets/ct-bicas-removebg-preview.png";
import backgroundCt from "../assets/ct-background.jpeg";
import professorCt from "../assets/professorct.jpeg";
import { InstagramEmbed } from 'react-social-media-embed';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-ct-dark min-h-screen text-ct-text font-sans overflow-x-hidden">
      
      {/* 1. HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-ct-dark/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow-lg">
              <img src={logoCt} alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-ct-gold">CT BICAS</span>
          </div>

          <nav className="hidden md:flex gap-8 font-semibold text-sm text-slate-300">
            <a href="#esportes" className="hover:text-ct-gold transition-colors">Esportes</a>
            <a href="#contato" className="hover:text-ct-gold transition-colors">Contato</a>
          </nav>

          <button 
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-ct-gold hover:bg-ct-gold-hover text-ct-dark font-black rounded-xl transition-all shadow-lg shadow-ct-gold/20"
          >
            Agendar Horário
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 px-6 min-h-[90vh] flex items-center">
        {/* Background Image Fix */}
        <div className="absolute inset-0 z-0">
          <img src={backgroundCt} alt="Background da Arena" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ct-dark via-ct-dark/90 to-transparent"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 bg-ct-gold/20 border border-ct-gold/50 rounded-full text-ct-gold font-bold text-sm tracking-widest mb-6 uppercase">
              O primeiro CT de Bicas/MG
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-6 drop-shadow-md">
              FORÇA NO ESPORTE.<br/>
              <span className="text-ct-gold">LEVEZA NA AREIA.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Junte-se ao CT Bicas. O melhor espaço para a prática de esportes de areia da região. Venha jogar, resenhar e evoluir com a gente! 
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-8 py-4 bg-ct-gold hover:bg-ct-gold-hover text-ct-dark font-black text-xl rounded-2xl transition-all transform hover:-translate-y-1 shadow-xl shadow-ct-gold/20"
              >
                Reservar Minha Quadra →
              </button>
              
              <div className="flex flex-col text-slate-300">
                <span className="font-medium text-sm uppercase opacity-70">A partir de</span>
                <span className="text-3xl font-black text-white flex items-baseline gap-1">
                  R$ 60<span className="text-lg font-bold text-ct-gold">/hr</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ESPORTES */}
      <section id="esportes" className="py-24 px-6 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">A Areia é Sua</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Temos a infraestrutura completa para você praticar o seu esporte preferido, chame a sua galera.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Futevolei */}
            <div className="bg-ct-dark border border-slate-800 p-8 rounded-3xl hover:border-ct-gold/50 transition-all group">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">⚽</div>
              <h3 className="text-2xl font-black text-white mb-3">Futevôlei</h3>
              <p className="text-slate-400">Levantadas, pingos e o famoso Shark Attack. A quadra ideal para quem tem habilidade com os pés.</p>
            </div>
            
            {/* Card Beach Tennis */}
            <div className="bg-ct-dark border border-slate-800 p-8 rounded-3xl hover:border-ct-gold/50 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-ct-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform relative z-10">🎾</div>
              <h3 className="text-2xl font-black text-white mb-3 relative z-10">Beach Tennis</h3>
              <p className="text-slate-400 relative z-10">A febre do momento! Dinâmico e muito divertido para todas as idades jogarem em dupla.</p>
            </div>

            {/* Card Volei de Areia */}
            <div className="bg-ct-dark border border-slate-800 p-8 rounded-3xl hover:border-ct-gold/50 transition-all group">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">🏐</div>
              <h3 className="text-2xl font-black text-white mb-3">Vôlei de Areia</h3>
              <p className="text-slate-400">Reúna o seu quarteto para saques, manchetes e bloqueios marcantes nas nossas redes ajustáveis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 AULAS EXPERIMENTAIS */}
      <section className="py-24 px-6 bg-ct-gold text-ct-dark border-y border-ct-gold/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Quer aprender a jogar com os melhores?</h2>
            <p className="text-xl font-medium mb-8 opacity-90">Não importa se você nunca tocou na bola de futevôlei ou se não sabe sacar no beach tennis. Nossos professores estão prontos para te ensinar do absoluto zero.</p>
            <a 
              href="https://wa.me/5532999999999?text=Ol%C3%A1%21%20Gostaria%20de%20agendar%20uma%20aula%20experimental%20no%20CT%20Bicas%21" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-ct-dark text-white hover:bg-slate-900 font-black text-xl rounded-2xl transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              <svg className="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.474-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.477 0 1.461 1.065 2.873 1.213 3.071.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Marcar Aula Experimental
            </a>
          </div>
          <div className="md:w-1/2 hidden md:flex justify-center relative">
            <div className="relative w-80 h-80 transform hover:scale-105 transition-transform duration-500 rounded-3xl overflow-hidden shadow-2xl border-4 border-ct-dark rotate-3">
              <img 
                src={professorCt} 
                alt="Alunos no CT Bicas" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-ct-gold/20 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INSTAGRAM FEED SIMULATION */}
      <section className="py-24 px-6 bg-ct-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Nossa Resenha</h2>
              <p className="text-slate-400 text-lg">Acompanhe os melhores momentos da arena.</p>
            </div>
            <a 
              href="https://instagram.com/ctbicas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-xl font-bold text-white hover:opacity-90 transition-opacity"
            >
              <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg> 
              Seguir @ctbicas
            </a>
          </div>

          {/* Grid do Feed - Instagram Embed */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            <InstagramEmbed url="https://www.instagram.com/p/DWkGAl1lOSk/?img_index=1" width={328} captioned={false} />
            <InstagramEmbed url="https://www.instagram.com/p/DRmZ26KjvBk/?img_index=1" width={328} captioned={false} />
            <InstagramEmbed url="https://www.instagram.com/p/DVoPXnKEehI/?img_index=1" width={328} captioned={false} />
            <InstagramEmbed url="https://www.instagram.com/p/DWKWNljkVCg/" width={328} captioned={false} />
          </div>
        </div>
      </section>

      {/* 5. FOOTER / CONTATO */}
      <footer id="contato" className="bg-black py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-1 rounded-lg">
                <img src={logoCt} alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white">CT BICAS</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              Sua arena de areia com estrutura premium, vestiários e quadras para Vôlei, Futevôlei e Beach Tennis.
            </p>
            <div className="flex gap-4">
               {/* Redes Sociais */}
              <a href="https://instagram.com/ctbicas" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-full text-slate-400 hover:text-pink-500 hover:bg-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://wa.me/5532999999999" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-full text-slate-400 hover:text-green-500 hover:bg-slate-800 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.474-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.477 0 1.461 1.065 2.873 1.213 3.071.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col md:items-end md:text-right gap-4 justify-center">
            <div>
              <h4 className="text-ct-gold font-bold mb-2 uppercase tracking-widest text-xs">Onde Estamos</h4>
              <p className="text-slate-300 font-medium">Bicas, Minas Gerais<br/>Rua Aristides de Souza Ramos, 22 / Bairro Alto das Brisas, Bicas</p>
            </div>
            <div className="mt-4">
              <h4 className="text-ct-gold font-bold mb-2 uppercase tracking-widest text-xs">Fale Conosco</h4>
              <p className="text-slate-300 font-medium text-xl">(32) 99999-9999</p>
            </div>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-900 text-center flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} CT Bicas. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <button onClick={() => navigate("/login")} className="hover:text-ct-gold transition-colors">Acessar Sistema</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
