import React from 'react';
import { 
  Shield, 
  Search, 
  FileText, 
  MapPin, 
  Phone, 
  Info, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2,
  Package,
  Smartphone,
  Bike,
  Car,
  Truck,
  CreditCard,
  X,
  Menu,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface RecoveredItem {
  id: number;
  category: string;
  description: string;
  serial_number: string | null;
  location_found: string;
  date_found: string;
}

// --- Components ---

const Navbar = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-pmro-blue text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <Shield className="w-10 h-10 text-pmro-gold" />
            <div>
              <h1 className="font-bold text-xl tracking-tight leading-none">PMRO</h1>
              <p className="text-[10px] uppercase tracking-widest text-pmro-gold font-semibold">Polícia Militar de Rondônia</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className="hover:text-pmro-gold transition-colors font-medium">Início</button>
            <button onClick={() => onNavigate('search')} className="hover:text-pmro-gold transition-colors font-medium">Consultar Bens</button>
            <button onClick={() => onNavigate('info')} className="hover:text-pmro-gold transition-colors font-medium">Informações</button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-pmro-dark border-t border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="block w-full text-left px-3 py-4 text-base font-medium border-b border-white/5">Início</button>
              <button onClick={() => { onNavigate('search'); setIsOpen(false); }} className="block w-full text-left px-3 py-4 text-base font-medium border-b border-white/5">Consultar Bens</button>
              <button onClick={() => { onNavigate('info'); setIsOpen(false); }} className="block w-full text-left px-3 py-4 text-base font-medium">Informações</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <section className="relative h-[600px] flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://picsum.photos/seed/police/1920/1080?blur=2" 
        alt="PMRO Background" 
        className="w-full h-full object-cover opacity-30"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-pmro-blue to-transparent" />
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-white"
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Recuperação de <span className="text-pmro-gold">Bens Perdidos</span> e Roubados
        </h2>
        <p className="text-xl mb-8 text-slate-200">
          A Polícia Militar de Rondônia trabalha incansavelmente para devolver o que é seu. 
          Consulte nossa base de itens recuperados.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => onNavigate('search')} className="btn-primary text-lg px-8 py-4">
            <Search className="w-5 h-5" /> Consultar Bens Recuperados
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

const SearchPage = () => {
  const [query, setQuery] = React.useState('');
  const [items, setItems] = React.useState<RecoveredItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/recovered?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-pmro-blue mb-4">Consulta de Bens Recuperados</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Pesquise por descrição, marca ou número de série (IMEI, Chassi, etc) para verificar se seu bem foi localizado pela PMRO.
        </p>
      </div>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Ex: iPhone 13, Corolla, Biz, Placa, IMEI..." 
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 focus:border-pmro-blue focus:outline-none transition-all shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary px-8">Buscar</button>
      </form>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pmro-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length > 0 ? items.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item.id} 
              className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-pmro-blue/5 rounded-xl text-pmro-blue group-hover:bg-pmro-blue group-hover:text-white transition-colors">
                  {item.category === 'Celular' ? <Smartphone /> : 
                   item.category === 'Bicicleta' ? <Bike /> : 
                   item.category === 'Carro' ? <Car /> :
                   item.category === 'Moto' ? <Truck /> :
                   <Package />}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-pmro-gold bg-pmro-gold/10 px-2 py-1 rounded">Recuperado</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{item.description}</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>S/N: {item.serial_number || 'Não informado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Local: {item.location_found}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span>Data: {new Date(item.date_found).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <button className="w-full mt-6 py-2 text-pmro-blue font-semibold border border-pmro-blue/20 rounded-lg hover:bg-pmro-blue hover:text-white transition-all">
                Ver Detalhes de Retirada
              </button>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300">
              <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Nenhum item encontrado com esses critérios.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ReportPage = () => {
  const [formData, setFormData] = React.useState({
    type: 'lost',
    category: 'Celular',
    description: '',
    serial_number: '',
    owner_name: '',
    owner_contact: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Registro Concluído!</h2>
        <p className="text-slate-600 mb-8">
          Seu registro foi enviado ao nosso banco de dados. Caso o item seja recuperado, entraremos em contato através dos dados fornecidos.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-primary mx-auto">Realizar Novo Registro</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-pmro-blue p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Registrar Bem Perdido ou Roubado</h2>
          <p className="text-blue-100">Forneça o máximo de detalhes para facilitar a identificação.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Tipo de Ocorrência</label>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pmro-blue outline-none"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="lost">Perda</option>
              <option value="stolen">Furto</option>
              <option value="robbed">Roubo</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Categoria do Bem</label>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pmro-blue outline-none"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Celular">Celular</option>
              <option value="Bicicleta">Bicicleta</option>
              <option value="Documentos">Documentos</option>
              <option value="Veículo">Veículo</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-slate-700">Descrição Detalhada</label>
            <textarea 
              required
              placeholder="Ex: iPhone 13 Pro Max, cor azul, com capinha preta, marca de uso no canto superior..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pmro-blue outline-none h-32"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Número de Série / IMEI / Chassi</label>
            <input 
              type="text"
              placeholder="Identificador único do bem"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pmro-blue outline-none"
              value={formData.serial_number}
              onChange={(e) => setFormData({...formData, serial_number: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Data do Fato</label>
            <input 
              type="date"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pmro-blue outline-none"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Nome do Proprietário</label>
            <input 
              required
              type="text"
              placeholder="Nome completo"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pmro-blue outline-none"
              value={formData.owner_name}
              onChange={(e) => setFormData({...formData, owner_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Contato (Telefone/Email)</label>
            <input 
              required
              type="text"
              placeholder="(69) 99999-9999"
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-pmro-blue outline-none"
              value={formData.owner_contact}
              onChange={(e) => setFormData({...formData, owner_contact: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button type="submit" className="btn-primary w-full py-4 text-lg">Enviar Registro</button>
            <p className="text-center text-xs text-slate-400 mt-4">
              Atenção: Este registro não substitui o Boletim de Ocorrência oficial. 
              Sempre registre um B.O. na delegacia mais próxima ou via Delegacia Virtual.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const InfoPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h2 className="text-4xl font-bold text-pmro-blue mb-8 text-center">Como Funciona?</h2>
    
    <div className="space-y-8">
      <div className="flex gap-6 items-start bg-white p-8 rounded-3xl shadow-sm">
        <div className="w-12 h-12 bg-pmro-blue text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xl">1</div>
        <div>
          <h3 className="text-xl font-bold mb-2">Recuperação pela PMRO</h3>
          <p className="text-slate-600">
            Diariamente, a Polícia Militar recupera diversos bens (veículos, celulares, bicicletas, etc). Estes itens são catalogados e inseridos em nossa base de dados pública para consulta.
          </p>
        </div>
      </div>

      <div className="flex gap-6 items-start bg-white p-8 rounded-3xl shadow-sm">
        <div className="w-12 h-12 bg-pmro-blue text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xl">2</div>
        <div>
          <h3 className="text-xl font-bold mb-2">Consulta e Identificação</h3>
          <p className="text-slate-600">
            O cidadão pode buscar por seu bem. Se encontrar algo compatível, deverá comparecer à unidade policial indicada portando documentos que comprovem a propriedade (Nota Fiscal, CRLV, caixa do produto, B.O., etc).
          </p>
        </div>
      </div>

      <div className="bg-pmro-gold/10 border-2 border-pmro-gold/20 p-8 rounded-3xl">
        <h3 className="text-xl font-bold text-pmro-blue mb-4 flex items-center gap-2">
          <AlertTriangle className="text-pmro-gold" /> Importante
        </h3>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>Sempre guarde as notas fiscais de seus eletrônicos.</li>
          <li>Anote o IMEI de seu celular (digite *#06# no discador).</li>
          <li>Em caso de roubo, priorize sua segurança e ligue 190 imediatamente.</li>
        </ul>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-pmro-dark text-white py-12 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-pmro-gold" />
            <h3 className="font-bold text-lg">PMRO</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Polícia Militar do Estado de Rondônia.<br />
            Servindo e Protegendo a sociedade rondoniense com honra e dedicação.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-pmro-gold uppercase tracking-wider text-sm">Links Úteis</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Portal do Governo</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Delegacia Virtual</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Ouvidoria</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Concursos</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-pmro-gold uppercase tracking-wider text-sm">Emergência</h4>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="p-3 bg-red-500 rounded-xl">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold">Ligue Agora</p>
              <p className="text-2xl font-black text-white">190</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 pt-8 border-t border-white/5 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} Polícia Militar de Rondônia. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <section className="max-w-7xl mx-auto px-4 py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-all">
                  <div className="w-16 h-16 bg-blue-50 text-pmro-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Consulta Rápida</h3>
                  <p className="text-slate-600 mb-6">Verifique em tempo real se seu bem (carro, moto, celular) foi recuperado por nossas equipes.</p>
                  <button onClick={() => setCurrentPage('search')} className="text-pmro-blue font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all">
                    Acessar Consulta <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-all">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Orientações</h3>
                  <p className="text-slate-600 mb-6">Saiba como proceder para retirar seus bens recuperados nas unidades.</p>
                  <button onClick={() => setCurrentPage('info')} className="text-pmro-blue font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all">
                    Ver Instruções <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </>
        );
      case 'search': return <SearchPage />;
      case 'info': return <InfoPage />;
      default: return <Hero onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar onNavigate={setCurrentPage} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
