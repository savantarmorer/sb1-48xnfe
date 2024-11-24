import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Plus, Save, Play, X, Settings } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import Button from '../Button';

interface BlockType {
  id: string;
  type: 'action' | 'condition' | 'trigger';
  name: string;
  config: Record<string, any>;
}

interface VisualBlock {
  id: string;
  type: BlockType;
  connections: string[];
  position: { x: number; y: number };
}

export default function VisualEditor() {
  const { dispatch } = useGame();
  const [blocks, setBlocks] = useState<VisualBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  const availableBlocks: BlockType[] = [
    {
      id: 'add_xp',
      type: 'action',
      name: 'Add XP',
      config: {
        amount: 100,
        reason: 'Custom Action'
      }
    },
    {
      id: 'add_coins',
      type: 'action',
      name: 'Add Coins',
      config: {
        amount: 50
      }
    },
    {
      id: 'unlock_achievement',
      type: 'action',
      name: 'Unlock Achievement',
      config: {
        achievementId: ''
      }
    },
    {
      id: 'level_check',
      type: 'condition',
      name: 'Check Level',
      config: {
        level: 5,
        comparison: 'gte'
      }
    },
    {
      id: 'quest_complete',
      type: 'trigger',
      name: 'On Quest Complete',
      config: {
        questId: ''
      }
    }
  ];

  const addBlock = (blockType: BlockType) => {
    const newBlock: VisualBlock = {
      id: `block_${Date.now()}`,
      type: blockType,
      connections: [],
      position: { x: 100, y: 100 }
    };
    setBlocks([...blocks, newBlock]);
    setShowBlockMenu(false);
  };

  const removeBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    if (selectedBlock === blockId) {
      setSelectedBlock(null);
    }
  };

  const updateBlockPosition = (blockId: string, position: { x: number; y: number }) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, position } : block
    ));
  };

  const connectBlocks = (sourceId: string, targetId: string) => {
    setBlocks(blocks.map(block => 
      block.id === sourceId 
        ? { ...block, connections: [...block.connections, targetId] }
        : block
    ));
  };

  const executeFlow = async () => {
    // Find trigger blocks
    const triggers = blocks.filter(block => block.type.type === 'trigger');
    
    // For each trigger, execute connected blocks in sequence
    for (const trigger of triggers) {
      await executeBlock(trigger.id);
    }
  };

  const executeBlock = async (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    // Execute block action based on type
    switch (block.type.id) {
      case 'add_xp':
        dispatch({
          type: 'ADD_XP',
          payload: {
            amount: block.type.config.amount,
            reason: block.type.config.reason
          }
        });
        break;
      case 'add_coins':
        dispatch({
          type: 'ADD_COINS',
          payload: block.type.config.amount
        });
        break;
      // Add more cases for other block types
    }

    // Execute connected blocks
    for (const connectionId of block.connections) {
      await executeBlock(connectionId);
    }
  };

  return (
    <div className="relative h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowBlockMenu(true)}
            icon={<Plus size={16} />}
          >
            Add Block
          </Button>
          <Button
            variant="outline"
            onClick={executeFlow}
            icon={<Play size={16} />}
          >
            Run Flow
          </Button>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            // Save flow configuration
            localStorage.setItem('visualFlow', JSON.stringify(blocks));
          }}
          icon={<Save size={16} />}
        >
          Save Flow
        </Button>
      </div>

      {/* Canvas */}
      <div className="absolute inset-0 mt-16 p-4">
        {blocks.map(block => (
          <motion.div
            key={block.id}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              updateBlockPosition(block.id, {
                x: block.position.x + info.offset.x,
                y: block.position.y + info.offset.y
              });
            }}
            className={`absolute p-4 rounded-lg shadow-lg ${
              block.type.type === 'action' ? 'bg-blue-100 dark:bg-blue-900/50' :
              block.type.type === 'condition' ? 'bg-purple-100 dark:bg-purple-900/50' :
              'bg-green-100 dark:bg-green-900/50'
            }`}
            style={{
              left: block.position.x,
              top: block.position.y,
              cursor: 'move'
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{block.type.name}</span>
              <button
                onClick={() => removeBlock(block.id)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-2">
              <button
                onClick={() => setSelectedBlock(block.id)}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Configure
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Block Menu */}
      {showBlockMenu && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Block</h3>
              <button
                onClick={() => setShowBlockMenu(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {availableBlocks.map(block => (
                <button
                  key={block.id}
                  onClick={() => addBlock(block)}
                  className="w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                >
                  <Code size={20} className={
                    block.type === 'action' ? 'text-blue-500' :
                    block.type === 'condition' ? 'text-purple-500' :
                    'text-green-500'
                  } />
                  <div>
                    <div className="font-medium">{block.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {block.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Block Configuration */}
      {selectedBlock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Configure Block</h3>
              <button
                onClick={() => setSelectedBlock(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {/* Add configuration fields based on block type */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 

