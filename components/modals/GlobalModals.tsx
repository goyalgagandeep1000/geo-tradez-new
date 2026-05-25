'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { useAppStore } from '@/store/appStore';
import { products } from '@/lib/mockData';
import { Crown } from 'lucide-react';

export function GlobalModals() {
  const { modal, closeModal, openModal, withdrawFunds, addToast, cart, walletBalance, checkout, addStoreProduct, createChannel } = useAppStore();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('Bank');
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const isOpen = modal.type !== null;
  const onClose = () => closeModal();

  const productId = modal.data?.productId as string | undefined;
  const product = productId ? products.find((p) => p.id === productId) : null;

  return (
    <>
      {/* Checkout */}
      <Modal
        open={modal.type === 'checkout'}
        onOpenChange={(o) => !o && onClose()}
        title="Checkout"
        description={product ? product.title : `${cart.length} item(s) in cart`}
      >
        {product && (
          <div className="flex gap-3 mb-4 p-3 bg-[#ecf4fb] rounded-xl border border-[#c8dae8]">
            <img src={product.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-bold text-[#1A1F2E]">{product.title}</p>
              <p className="text-lg font-extrabold text-[#4A7C24] mt-1">${product.price}.00</p>
            </div>
          </div>
        )}
        <p className="text-sm text-[#6B7280] mb-4">Secure demo checkout — no real payment processed.</p>
        <button
          onClick={() => {
            const ids = productId ? [productId] : cart;
            checkout(ids);
          }}
          className="w-full py-3 bg-[#4A7C24] text-white font-semibold rounded-xl hover:bg-[#3A6B1A]"
        >
          Complete Purchase
        </button>
      </Modal>

      {/* Withdraw */}
      <Modal
        open={modal.type === 'withdraw'}
        onOpenChange={(o) => !o && onClose()}
        title="Withdraw Funds"
        description={`Available: $${walletBalance.toFixed(2)}`}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#374151] mb-1 block">Amount (USD)</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-[#c8dae8] rounded-xl text-sm focus:outline-none focus:border-[#4A7C24] focus:ring-2 focus:ring-[#4A7C24]/15"
            />
          </div>
          <div className="flex gap-2">
            {['Bank', 'PayPal', 'Wise'].map((m) => (
              <button
                key={m}
                onClick={() => setWithdrawMethod(m)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  withdrawMethod === m
                    ? 'bg-[#F0F7E8] border-[#4A7C24] text-[#3A6B1A]'
                    : 'border-[#c8dae8] text-[#6B7280] hover:bg-[#ecf4fb]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={async () => {
              const amt = parseFloat(withdrawAmount);
              const ok = await withdrawFunds(amt, withdrawMethod);
              if (ok) {
                setWithdrawAmount('');
                onClose();
              }
            }}
            className="w-full py-3 bg-[#4A7C24] text-white font-semibold rounded-xl hover:bg-[#3A6B1A]"
          >
            Confirm Withdrawal
          </button>
        </div>
      </Modal>

      {/* Add Product */}
      <Modal
        open={modal.type === 'add-product'}
        onOpenChange={(o) => !o && onClose()}
        title="Add New Product"
        description="Create a listing for your store"
      >
        <div className="space-y-3">
          <input
            value={productTitle}
            onChange={(e) => setProductTitle(e.target.value)}
            placeholder="Product title"
            className="w-full px-4 py-2.5 border border-[#c8dae8] rounded-xl text-sm focus:outline-none focus:border-[#4A7C24]"
          />
          <input
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="Price (USD)"
            type="number"
            className="w-full px-4 py-2.5 border border-[#c8dae8] rounded-xl text-sm focus:outline-none focus:border-[#4A7C24]"
          />
          <button
            onClick={async () => {
              if (!productTitle.trim()) {
                addToast('Enter a product title', 'error');
                return;
              }
              await addStoreProduct({
                title: productTitle,
                category: 'General',
                price: parseFloat(productPrice) || 0,
              });
              setProductTitle('');
              setProductPrice('');
              onClose();
            }}
            className="w-full py-3 bg-[#4A7C24] text-white font-semibold rounded-xl hover:bg-[#3A6B1A]"
          >
            Publish Product
          </button>
        </div>
      </Modal>

      {/* Edit Store */}
      <Modal
        open={modal.type === 'edit-store'}
        onOpenChange={(o) => !o && onClose()}
        title="Edit Store"
        description="Update your storefront details"
      >
        <p className="text-sm text-[#6B7280] mb-4">Customize branding, policies, and SEO in one place.</p>
        <Link
          href="/settings"
          onClick={onClose}
          className="block w-full py-3 text-center bg-[#4A7C24] text-white font-semibold rounded-xl hover:bg-[#3A6B1A]"
        >
          Open Store Settings
        </Link>
      </Modal>

      {/* Create Channel */}
      <Modal
        open={modal.type === 'create-channel'}
        onOpenChange={(o) => !o && onClose()}
        title="Create Channel"
        description="Build a new space for your community"
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Text Channel', icon: '💬' },
            { label: 'Voice Room', icon: '🎙️' },
            { label: 'Private Group', icon: '🔒' },
            { label: 'Live Event', icon: '📡' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={async () => {
                await createChannel(item.label.replace(/\s+/g, '-').toLowerCase());
                onClose();
              }}
              className="p-4 rounded-xl border border-[#c8dae8] hover:border-[#4A7C24] hover:bg-[#F0F7E8] text-left transition-colors"
            >
              <span className="text-xl mb-1 block">{item.icon}</span>
              <span className="text-xs font-bold text-[#374151]">{item.label}</span>
            </button>
          ))}
        </div>
      </Modal>

      {/* Upgrade Pro */}
      <Modal
        open={modal.type === 'upgrade-pro'}
        onOpenChange={(o) => !o && onClose()}
        title="Upgrade to Pro"
        description="Unlock premium tools for global selling"
      >
        <div className="space-y-3 mb-4">
          {['Lower fees & faster payouts', 'Advanced AI creation', 'Priority support', 'Global analytics'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-[#374151]">
              <Crown className="w-4 h-4 text-[#4A7C24] shrink-0" />
              {f}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            addToast('Welcome to Geotradez Pro!');
            onClose();
          }}
          className="w-full py-3 bg-[#4A7C24] text-white font-semibold rounded-xl hover:bg-[#3A6B1A]"
        >
          Upgrade — $29/mo
        </button>
      </Modal>

      {/* Quick view */}
      <Modal
        open={modal.type === 'quick-view'}
        onOpenChange={(o) => !o && onClose()}
        title={product?.title ?? 'Product'}
        className="max-w-lg"
      >
        {product && (
          <>
            <img src={product.image} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
            <p className="text-2xl font-bold text-[#4A7C24] mb-4">${product.price}.00</p>
            <div className="flex gap-2">
              <Link
                href={`/discover/${product.id}`}
                onClick={onClose}
                className="flex-1 py-2.5 text-center border border-[#c8dae8] rounded-xl text-sm font-semibold hover:bg-[#ecf4fb]"
              >
                View Details
              </Link>
              <button
                onClick={() => {
                  useAppStore.getState().addToCart(product.id);
                  onClose();
                }}
                className="flex-1 py-2.5 bg-[#4A7C24] text-white rounded-xl text-sm font-semibold hover:bg-[#3A6B1A]"
              >
                Add to Cart
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
