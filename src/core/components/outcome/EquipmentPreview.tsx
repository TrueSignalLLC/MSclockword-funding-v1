import React from 'react';

interface EquipmentPreviewProps {
  config: {
    title: string;
    items: Array<{
      image: string;
      title: string;
      description: string;
    }>;
  };
}

export const EquipmentPreview: React.FC<EquipmentPreviewProps> = ({ config }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/ADT (1).jpg" 
              alt="ADT" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <h2 className="text-4xl font-bold text-gray-900">
              {config.title}
            </h2>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {config.items.map((item, index) => (
            <div key={index} className="text-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-gray-50 rounded-xl p-8 mb-6 h-56 flex items-center justify-center">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="max-h-40 max-w-40 object-contain"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className = 'w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center';
                    placeholder.innerHTML = '<span class="text-gray-500 text-lg font-medium">Equipment</span>';
                    e.currentTarget.parentNode?.appendChild(placeholder);
                  }}
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};