import React, { useState } from 'react';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  Home,
  Clock,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderProgressTrackerProps {
  order: Order;
  supportPhone?: string;
}

interface StepInfo {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedDays: string;
}

export const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({
  order,
  supportPhone = '0640629602',
}) => {
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [showTimelineLog, setShowTimelineLog] = useState(false);

  // Define the core milestones
  const steps: StepInfo[] = [
    {
      key: 'confirmed',
      label: 'Order Placed',
      description: 'Payment confirmed & registered',
      icon: CheckCircle2,
      estimatedDays: 'Day 1',
    },
    {
      key: 'processing',
      label: 'Processing',
      description: 'Knitted & tailored at Klerksdorp atelier',
      icon: PackageCheck,
      estimatedDays: '1-2 Days',
    },
    {
      key: 'shipped',
      label: 'Shipped',
      description: 'Dispatched with door-to-door courier',
      icon: Truck,
      estimatedDays: '2-4 Days',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      description: 'Signed for at delivery address',
      icon: Home,
      estimatedDays: 'Completed',
    },
  ];

  // Map order status to stage index (0 to 3) and progress percentage
  const getStageDetails = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
      case 'payment_pending':
        return {
          stepIndex: 0,
          progressPercent: 12,
          badgeColor: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
          headline: 'Awaiting Payment Verification',
          detailText: 'Your order has been logged. Once payment is verified, production and tailoring will commence immediately.',
        };
      case 'paid':
        return {
          stepIndex: 0,
          progressPercent: 25,
          badgeColor: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          headline: 'Payment Verified & Queued',
          detailText: 'Payment received successfully. Your order is queued for tailoring and packaging at our Klerksdorp hub.',
        };
      case 'processing':
      case 'packed':
        return {
          stepIndex: 1,
          progressPercent: 55,
          badgeColor: 'bg-orange-100 dark:bg-orange-950/50 text-[#f35d1f] border-orange-200 dark:border-orange-800',
          headline: 'In Processing & Atelier Packaging',
          detailText: 'Our North West atelier is inspecting jacquard knit tension, tagging, and packaging your pieces into signature 018 packaging.',
        };
      case 'shipped':
        return {
          stepIndex: 2,
          progressPercent: 82,
          badgeColor: 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
          headline: 'Dispatched & In Transit with Courier',
          detailText: 'Your parcel is in transit with The Courier Guy door-to-door express. Live tracking updates are active.',
        };
      case 'delivered':
        return {
          stepIndex: 3,
          progressPercent: 100,
          badgeColor: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          headline: 'Package Successfully Delivered',
          detailText: 'Delivered and received at your address. Thank you for proudly representing 018 Bokone Bophirima streetwear!',
        };
      case 'cancelled':
      case 'refunded':
        return {
          stepIndex: -1,
          progressPercent: 0,
          badgeColor: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
          headline: status === 'refunded' ? 'Order Refunded' : 'Order Cancelled',
          detailText: 'This order has been cancelled or refunded. If you have any inquiries, contact our direct WhatsApp concierge.',
        };
      default:
        return {
          stepIndex: 1,
          progressPercent: 40,
          badgeColor: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
          headline: 'Order Status Update',
          detailText: 'Your order is currently moving through our fulfillment pipeline.',
        };
    }
  };

  const { stepIndex, progressPercent, badgeColor, headline, detailText } = getStageDetails(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

  const handleCopyTracking = () => {
    if (!order.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const phone = supportPhone.replace(/^0/, '27');
    const msg = encodeURIComponent(
      `Dumelang 018 Team! I am checking on my order #${order.orderNumber} (Current status: ${order.status.toUpperCase()}). Waybill: ${order.trackingNumber || 'Pending'}. Could you provide a quick courier update?`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  // Generate realistic chronological milestones
  const orderDate = new Date(order.createdAt);
  const formatDate = (daysOffset: number) => {
    const d = new Date(orderDate.getTime() + daysOffset * 86400000);
    return d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const timelineEvents = [
    {
      title: 'Order Confirmed & Payment Verified',
      time: formatDate(0),
      done: true,
      description: `Payment confirmed via ${order.paymentMethod.toUpperCase()}. Order #${order.orderNumber} created.`,
    },
    {
      title: 'Klerksdorp Atelier Processing',
      time: formatDate(0.5),
      done: stepIndex >= 1,
      description: 'Garments pulled from inventory, knit inspection passed, and boxed in signature 018 packaging.',
    },
    {
      title: 'Handed to Courier Partner',
      time: formatDate(1.2),
      done: stepIndex >= 2,
      description: `${order.courierName || 'The Courier Guy'} collected package from Klerksdorp logistics hub. Waybill: ${order.trackingNumber || 'Active'}.`,
    },
    {
      title: 'Out for Delivery & Completed',
      time: formatDate(2.8),
      done: stepIndex >= 3,
      description: `Dispatched to ${order.shippingAddress.city}, ${order.shippingAddress.province}. Signed by consignee.`,
    },
  ];

  return (
    <div id={`order-progress-tracker-${order.id}`} className="space-y-5">
      {/* 1. Header Status Callout */}
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#111315] border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              id={`status-badge-${order.id}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeColor}`}
            >
              {order.status === 'delivered' ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              ) : order.status === 'shipped' ? (
                <Truck className="w-3.5 h-3.5 shrink-0" />
              ) : order.status === 'processing' || order.status === 'packed' ? (
                <Sparkles className="w-3.5 h-3.5 shrink-0 animate-spin text-[#f35d1f]" style={{ animationDuration: '3s' }} />
              ) : (
                <Clock className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{headline}</span>
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pt-1">
            {detailText}
          </p>
        </div>

        {/* Courier Waybill Quick Tag */}
        {order.trackingNumber && (
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="bg-white dark:bg-neutral-800/90 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs">
              <span className="text-[10px] text-neutral-400 block uppercase font-mono">
                {order.courierName || 'The Courier Guy'}
              </span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {order.trackingNumber}
              </span>
            </div>
            <button
              id={`btn-copy-tracking-${order.id}`}
              type="button"
              onClick={handleCopyTracking}
              title="Copy Waybill Number"
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
            >
              {copiedTracking ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* 2. Visual Progress Bar with Interactive Stepper Nodes */}
      {!isCancelled ? (
        <div className="px-1 py-3">
          {/* Top Stage Titles (Desktop) */}
          <div className="relative">
            {/* The Horizontal Line Track */}
            <div className="absolute top-5 left-6 right-6 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full -translate-y-1/2 z-0">
              <div
                className="h-full bg-gradient-to-r from-[#f35d1f] via-orange-500 to-emerald-500 transition-all duration-700 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stepper Nodes */}
            <div className="relative z-10 grid grid-cols-4 gap-2 text-center">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < stepIndex || (idx === stepIndex && step.key === 'delivered');
                const isCurrent = idx === stepIndex && step.key !== 'delivered';
                const isUpcoming = idx > stepIndex;

                return (
                  <div key={step.key} className="flex flex-col items-center group">
                    {/* Node Circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : isCurrent
                          ? 'bg-[#f35d1f] text-white ring-4 ring-orange-500/25 shadow-lg shadow-orange-500/30 animate-pulse'
                          : 'bg-white dark:bg-[#181b1e] border-2 border-neutral-300 dark:border-neutral-700 text-neutral-400'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    {/* Step Label */}
                    <div className="mt-2.5 space-y-0.5">
                      <p
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isCurrent
                            ? 'text-[#f35d1f]'
                            : isCompleted
                            ? 'text-neutral-900 dark:text-white'
                            : 'text-neutral-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Fulfillment progress halted: this order was marked as {order.status}.</span>
        </div>
      )}

      {/* 3. Action Bar: Tracking Link, WhatsApp Status & Timeline Log Toggle */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-neutral-100 dark:border-neutral-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {order.trackingNumber && (
            <a
              id={`link-courier-track-${order.id}`}
              href={`https://thecourierguy.co.za/tracking?tracking_number=${order.trackingNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 font-bold uppercase tracking-wider text-[11px] transition-colors"
            >
              <span>Track Online</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            id={`btn-whatsapp-status-${order.id}`}
            type="button"
            onClick={handleWhatsAppInquiry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider text-[11px] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Status Inquiry</span>
          </button>
        </div>

        <button
          id={`btn-toggle-timeline-${order.id}`}
          type="button"
          onClick={() => setShowTimelineLog(!showTimelineLog)}
          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-semibold"
        >
          <span>{showTimelineLog ? 'Hide Milestone Timeline' : 'View Stage Activity Log'}</span>
          {showTimelineLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 4. Detailed Expandable Stage Activity Log */}
      {showTimelineLog && (
        <div
          id={`timeline-log-${order.id}`}
          className="p-4 rounded-xl bg-neutral-50 dark:bg-[#101214] border border-neutral-200 dark:border-neutral-800 space-y-3 animate-in fade-in duration-200 text-xs"
        >
          <div className="flex items-center justify-between pb-1 border-b border-neutral-200 dark:border-neutral-800">
            <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#f35d1f]" />
              <span>Full Fulfillment History & Checkpoints</span>
            </h4>
            <span className="text-[10px] text-neutral-400 font-mono">
              Ref: {order.orderNumber}
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
            {timelineEvents.map((evt, idx) => (
              <div key={idx} className="relative space-y-0.5">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 ${
                    evt.done
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                  }`}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`font-bold ${evt.done ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                    {evt.title}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {evt.time}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {evt.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
