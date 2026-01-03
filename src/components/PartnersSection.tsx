const partners = [
  {
    name: 'Bitmain',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Bitmain_logo.svg/1200px-Bitmain_logo.svg.png',
  },
  {
    name: 'MicroBT',
    logo: 'https://www.microbt.com/static/img/logo.png',
  },
  {
    name: 'Canaan',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Canaan_Creative_logo.svg/2560px-Canaan_Creative_logo.svg.png',
  },
  {
    name: 'Goldshell',
    logo: 'https://www.goldshell.com/wp-content/uploads/2021/09/goldshell-logo.svg',
  },
  {
    name: 'IceRiver',
    logo: 'https://iceriver.io/wp-content/uploads/2023/12/logo.svg',
  },
];

const PartnersSection = () => {
  return (
    <section className="py-16 border-y border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl font-semibold text-center mb-10 text-muted-foreground">
          Our Partners
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner) => (
            <div 
              key={partner.name} 
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="h-8 md:h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;