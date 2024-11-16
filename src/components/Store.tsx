import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap, Book, Users, Crown, Star } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'booster' | 'material' | 'session' | 'cosmetic';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: React.ReactNode;
  available: boolean;
}

export default function Store() {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | StoreItem['type']>('all');
  const [purchaseStatus, setPurchaseStatus] = useState<{
    id: string;
    status: 'idle' | 'processing' | 'success' | 'error';
  }>({ id: '', status: 'idle' });

  const STORE_ITEMS: StoreItem[] = [
    {
      id: 'xp_booster_24h',
      title: t('store.items.xpBooster.title'),
      description: t('store.items.xpBooster.description'),
      price: 1000,
      type: 'booster',
      rarity: 'rare',
      icon: <Zap className="text-blue-500" size={24} />,
      available: true
    },
    {
      id: 'mock_exam_bundle',
      title: t('store.items.studyMaterial.title'),
      description: t('store.items.studyMaterial.description'),
      price: 2000,
      type: 'material',
      rarity: 'epic',
      icon: <Book className="text-purple-500" size={24} />,
      available: true
    },
    {
      id: 'expert_session',
      title: t('store.items.expertSession.title'),
      description: t('store.items.expertSession.description'),
      price: 5000,
      type: 'session',
      rarity: 'legendary',
      icon: <Users className="text-yellow-500" size={24} />,
      available: true
    }
  ];

  const filteredItems = STORE_ITEMS.filter(
    item => selectedCategory === 'all' || item.type === selectedCategory
  );

  const purchaseItem = async (item: StoreItem) => {
    if (state.user.coins < item.price) return;

    setPurchaseStatus({ id: item.id, status: 'processing' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({
        type: 'PURCHASE_ITEM',
        payload: { itemId: item.id, cost: item.price }
      });
      
      setPurchaseStatus({ id: item.id, status: 'success' });
      
      setTimeout(() => {
        setPurchaseStatus({ id: '', status: 'idle' });
      }, 2000);
    } catch (error) {
      setPurchaseStatus({ id: item.id, status: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading text-2xl">{t('store.title')}</h2>
        <div className="flex items-center space-x-2">
          <ShoppingBag className="text-indigo-500" />
          <span className="font-bold text-xl">{state.user.coins} {t('common.coins')}</span>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        <CategoryButton
          active={selectedCategory === 'all'}
          onClick={() => setSelectedCategory('all')}
        >
          {t('store.categories.all')}
        </CategoryButton>
        <CategoryButton
          active={selectedCategory === 'booster'}
          onClick={() => setSelectedCategory('booster')}
        >
          {t('store.categories.boosters')}
        </CategoryButton>
        <CategoryButton
          active={selectedCategory === 'material'}
          onClick={() => setSelectedCategory('material')}
        >
          {t('store.categories.materials')}
        </CategoryButton>
        <CategoryButton
          active={selectedCategory === 'session'}
          onClick={() => setSelectedCategory('session')}
        >
          {t('store.categories.sessions')}
        </CategoryButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`card ${item.rarity}-card`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-primary">{item.title}</h3>
                    <span className={`badge rarity-${item.rarity}`}>
                      {t(`items.rarity.${item.rarity}`)}
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-1">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-500" size={16} />
                      <span className="font-medium">{item.price}</span>
                    </div>
                    <PurchaseButton
                      item={item}
                      status={purchaseStatus}
                      canAfford={state.user.coins >= item.price}
                      onPurchase={() => purchaseItem(item)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface CategoryButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function CategoryButton({ children, active, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-indigo-600 text-white dark:bg-indigo-500'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
      }`}
    >
      {children}
    </button>
  );
}

interface PurchaseButtonProps {
  item: StoreItem;
  status: { id: string; status: string };
  canAfford: boolean;
  onPurchase: () => void;
}

function PurchaseButton({ item, status, canAfford, onPurchase }: PurchaseButtonProps) {
  const { t } = useLanguage();
  const isProcessing = status.id === item.id && status.status === 'processing';
  const isSuccess = status.id === item.id && status.status === 'success';

  return (
    <motion.button
      whileHover={canAfford ? { scale: 1.05 } : undefined}
      whileTap={canAfford ? { scale: 0.95 } : undefined}
      onClick={onPurchase}
      disabled={!canAfford || isProcessing}
      className={`btn ${
        isProcessing ? 'bg-gray-400 dark:bg-gray-600 cursor-wait' :
        isSuccess ? 'bg-green-500 hover:bg-green-600 text-white' :
        canAfford ? 'btn-primary' :
        'btn-secondary opacity-50 cursor-not-allowed'
      }`}
    >
      {isProcessing ? t('store.purchase.processing') :
       isSuccess ? t('store.purchase.success') :
       canAfford ? t('common.purchase') :
       t('store.purchase.insufficientFunds')}
    </motion.button>
  );
}