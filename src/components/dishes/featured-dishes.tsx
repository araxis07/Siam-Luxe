"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { AppLocale } from "@/i18n/routing";
import type { LocalizedMenuDish } from "@/lib/catalog";
import { DishCard } from "@/components/dishes/dish-card";

export function FeaturedDishes({
  dishes,
  locale,
}: {
  dishes: LocalizedMenuDish[];
  locale: AppLocale;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {dishes.map((dish, index) => (
        <motion.div
          key={dish.id}
          initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.08 }}
        >
          <DishCard dish={dish} locale={locale} compact />
        </motion.div>
      ))}
    </div>
  );
}
