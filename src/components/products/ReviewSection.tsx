"use client";

import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import type { IReview } from "@/types";

interface ReviewSectionProps {
  productId: string;
}

function StarRating({
  value,
  onChange,
  size = 14,
  interactive = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  interactive?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={`${interactive ? "cursor-pointer" : "cursor-default"} p-0.5`}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= value ? "#10151C" : "none"}
            stroke={star <= value ? "#10151C" : "#cbd5e1"}
            strokeWidth="1.5"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function ReviewForm({
  productId,
  onSubmit,
}: {
  productId: string;
  onSubmit: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || rating === 0 || !comment.trim()) {
      toast.error("All fields are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId, name, email, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }
      toast.success("Review submitted!");
      setName("");
      setEmail("");
      setRating(0);
      setComment("");
      onSubmit();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-light-gray bg-white text-deep-navy placeholder:text-mid-gray/40 focus:outline-none focus:border-deep-navy transition-colors"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-light-gray bg-white text-deep-navy placeholder:text-mid-gray/40 focus:outline-none focus:border-deep-navy transition-colors"
        />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-mid-gray uppercase tracking-[0.2em] font-medium">
          Rating
        </span>
        <StarRating value={rating} onChange={setRating} size={16} interactive />
      </div>
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        maxLength={2000}
        className="w-full px-3 py-2 text-xs border border-light-gray bg-white text-deep-navy placeholder:text-mid-gray/40 focus:outline-none focus:border-deep-navy transition-colors resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-[9px] text-mid-gray/40">{comment.length}/2000</span>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 bg-deep-navy text-white text-[10px] tracking-[0.15em] uppercase font-medium hover:bg-black transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <section className="mt-16 pt-12 border-t border-light-gray/50">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] text-mid-gray uppercase tracking-[0.25em] font-medium mb-1">
            Reviews
          </p>
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-playfair font-bold text-deep-navy">
              {totalReviews > 0 ? averageRating.toFixed(1) : "0.0"}
            </h2>
            <div className="flex flex-col">
              <StarRating value={Math.round(averageRating)} size={12} />
              <span className="text-[9px] text-mid-gray/60 mt-0.5">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-1.5 border border-deep-navy/20 text-deep-navy text-[10px] tracking-[0.15em] uppercase font-medium hover:bg-deep-navy hover:text-white transition-all duration-300"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-5 border border-light-gray bg-cool-ivory/30">
          <p className="text-[10px] text-deep-navy uppercase tracking-[0.2em] font-medium mb-4">
            Share Your Thoughts
          </p>
          <ReviewForm productId={productId} onSubmit={() => { setShowForm(false); fetchReviews(); }} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-4 h-4 border border-deep-navy/30 border-t-deep-navy rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-mid-gray/60 text-center py-8">
          No reviews yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="pb-5 border-b border-light-gray/30 last:border-b-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-deep-navy">{review.name}</span>
                <span className="text-[9px] text-mid-gray/40">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <StarRating value={review.rating} size={11} />
              <p className="text-xs text-mid-gray leading-relaxed mt-1.5">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
