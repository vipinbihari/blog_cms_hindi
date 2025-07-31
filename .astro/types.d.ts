declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"posts": {
"50-30-20-rule-budgeting-first-salary-india.mdx": {
	id: "50-30-20-rule-budgeting-first-salary-india.mdx";
  slug: "50-30-20-rule-budgeting-first-salary-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"a-beginners-guide-to-reading-financial-statements.mdx": {
	id: "a-beginners-guide-to-reading-financial-statements.mdx";
  slug: "a-beginners-guide-to-reading-financial-statements";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"a-beginners-guide-to-understanding-the-indian-stock-market.mdx": {
	id: "a-beginners-guide-to-understanding-the-indian-stock-market.mdx";
  slug: "a-beginners-guide-to-understanding-the-indian-stock-market";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"apollo-hospitals-demerger-digital-pharmacy-unlocks-value.mdx": {
	id: "apollo-hospitals-demerger-digital-pharmacy-unlocks-value.mdx";
  slug: "apollo-hospitals-demerger-digital-pharmacy-unlocks-value";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"art-of-salary-negotiation-first-job-india.mdx": {
	id: "art-of-salary-negotiation-first-job-india.mdx";
  slug: "art-of-salary-negotiation-first-job-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"basic-options-trading-strategies-for-beginners.mdx": {
	id: "basic-options-trading-strategies-for-beginners.mdx";
  slug: "basic-options-trading-strategies-for-beginners";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"beginners-guide-derivatives-futures-options.mdx": {
	id: "beginners-guide-derivatives-futures-options.mdx";
  slug: "beginners-guide-derivatives-futures-options";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"beginners-guide-filing-itr-india-fy-2024-25.mdx": {
	id: "beginners-guide-filing-itr-india-fy-2024-25.mdx";
  slug: "beginners-guide-filing-itr-india-fy-2024-25";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"beginners-guide-fundamental-analysis-of-stocks-india.mdx": {
	id: "beginners-guide-fundamental-analysis-of-stocks-india.mdx";
  slug: "beginners-guide-fundamental-analysis-of-stocks-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"beginners-guide-technical-analysis-of-stocks.mdx": {
	id: "beginners-guide-technical-analysis-of-stocks.mdx";
  slug: "beginners-guide-technical-analysis-of-stocks";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"behavioral-finance-how-emotions-affect-investing.mdx": {
	id: "behavioral-finance-how-emotions-affect-investing.mdx";
  slug: "behavioral-finance-how-emotions-affect-investing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"building-a-diversified-stock-portfolio-india.mdx": {
	id: "building-a-diversified-stock-portfolio-india.mdx";
  slug: "building-a-diversified-stock-portfolio-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"cibil-score-explained-guide-to-good-credit.mdx": {
	id: "cibil-score-explained-guide-to-good-credit.mdx";
  slug: "cibil-score-explained-guide-to-good-credit";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"common-mistakes-beginner-investors-india.mdx": {
	id: "common-mistakes-beginner-investors-india.mdx";
  slug: "common-mistakes-beginner-investors-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"corporate-actions-explained-dividends-splits-buybacks.mdx": {
	id: "corporate-actions-explained-dividends-splits-buybacks.mdx";
  slug: "corporate-actions-explained-dividends-splits-buybacks";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"couples-guide-to-money-management-india.mdx": {
	id: "couples-guide-to-money-management-india.mdx";
  slug: "couples-guide-to-money-management-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-defiance-nifty-soars-past-24900.mdx": {
	id: "dalal-street-defiance-nifty-soars-past-24900.mdx";
  slug: "dalal-street-defiance-nifty-soars-past-24900";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-ends-week-lower-sensex-slips-182-points-nifty-below-24800-gdp-jitters-global-cues-may-30-2025.mdx": {
	id: "dalal-street-ends-week-lower-sensex-slips-182-points-nifty-below-24800-gdp-jitters-global-cues-may-30-2025.mdx";
  slug: "dalal-street-ends-week-lower-sensex-slips-182-points-nifty-below-24800-gdp-jitters-global-cues-may-30-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-rallies-ahead-rbi-policy-sensex-nifty-gain-june-5-2025.mdx": {
	id: "dalal-street-rallies-ahead-rbi-policy-sensex-nifty-gain-june-5-2025.mdx";
  slug: "dalal-street-rallies-ahead-rbi-policy-sensex-nifty-gain-june-5-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-rebound-sensex-nifty-june-4-2025.mdx": {
	id: "dalal-street-rebound-sensex-nifty-june-4-2025.mdx";
  slug: "dalal-street-rebound-sensex-nifty-june-4-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-roars-sensex-nifty-surge-global-relief-oil-plunge.mdx": {
	id: "dalal-street-roars-sensex-nifty-surge-global-relief-oil-plunge.mdx";
  slug: "dalal-street-roars-sensex-nifty-surge-global-relief-oil-plunge";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-seesaws-sensex-nifty-tumble-june-3-2025.mdx": {
	id: "dalal-street-seesaws-sensex-nifty-tumble-june-3-2025.mdx";
  slug: "dalal-street-seesaws-sensex-nifty-tumble-june-3-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"dalal-street-tumbles-sensex-nifty-snap-rally-may-27-2025.mdx": {
	id: "dalal-street-tumbles-sensex-nifty-snap-rally-may-27-2025.mdx";
  slug: "dalal-street-tumbles-sensex-nifty-snap-rally-may-27-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"day-6-industry-economic-analysis-investing.mdx": {
	id: "day-6-industry-economic-analysis-investing.mdx";
  slug: "day-6-industry-economic-analysis-investing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"day-7-technical-analysis-part-1-chart-types-trend-basics.mdx": {
	id: "day-7-technical-analysis-part-1-chart-types-trend-basics.mdx";
  slug: "day-7-technical-analysis-part-1-chart-types-trend-basics";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"day-9-technical-chart-patterns.mdx": {
	id: "day-9-technical-chart-patterns.mdx";
  slug: "day-9-technical-chart-patterns";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"decoding-the-rally-sensex-surge-nifty-conquers-25k.mdx": {
	id: "decoding-the-rally-sensex-surge-nifty-conquers-25k.mdx";
  slug: "decoding-the-rally-sensex-surge-nifty-conquers-25k";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"decoding-your-salary-slip-ctc-gross-in-hand-pay.mdx": {
	id: "decoding-your-salary-slip-ctc-gross-in-hand-pay.mdx";
  slug: "decoding-your-salary-slip-ctc-gross-in-hand-pay";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"derivatives-explained-beginners-guide-futures-options.mdx": {
	id: "derivatives-explained-beginners-guide-futures-options.mdx";
  slug: "derivatives-explained-beginners-guide-futures-options";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"digital-gold-vs-gold-etfs-vs-sgbs-best-gold-investment-2025.mdx": {
	id: "digital-gold-vs-gold-etfs-vs-sgbs-best-gold-investment-2025.mdx";
  slug: "digital-gold-vs-gold-etfs-vs-sgbs-best-gold-investment-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"economic-indicators-and-the-stock-market.mdx": {
	id: "economic-indicators-and-the-stock-market.mdx";
  slug: "economic-indicators-and-the-stock-market";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"elss-mutual-funds-tax-saving-wealth-creation.mdx": {
	id: "elss-mutual-funds-tax-saving-wealth-creation.mdx";
  slug: "elss-mutual-funds-tax-saving-wealth-creation";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"first-apartment-financial-checklist-india.mdx": {
	id: "first-apartment-financial-checklist-india.mdx";
  slug: "first-apartment-financial-checklist-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"first-job-first-bank-account-how-to-choose-right-savings-account-india.mdx": {
	id: "first-job-first-bank-account-how-to-choose-right-savings-account-india.mdx";
  slug: "first-job-first-bank-account-how-to-choose-right-savings-account-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"fundamental-analysis-financial-statements-day-4.mdx": {
	id: "fundamental-analysis-financial-statements-day-4.mdx";
  slug: "fundamental-analysis-financial-statements-day-4";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"fundamental-analysis-ratios-valuations-day-5.mdx": {
	id: "fundamental-analysis-ratios-valuations-day-5.mdx";
  slug: "fundamental-analysis-ratios-valuations-day-5";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"gabriel-india-stock-surge-analysis.mdx": {
	id: "gabriel-india-stock-surge-analysis.mdx";
  slug: "gabriel-india-stock-surge-analysis";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"geopolitical-shockwave-sensex-nifty-tumble-us-iran.mdx": {
	id: "geopolitical-shockwave-sensex-nifty-tumble-us-iran.mdx";
  slug: "geopolitical-shockwave-sensex-nifty-tumble-us-iran";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"geopolitical-whiplash-sensex-swings-wildly-on-ceasefire-news.mdx": {
	id: "geopolitical-whiplash-sensex-swings-wildly-on-ceasefire-news.mdx";
  slug: "geopolitical-whiplash-sensex-swings-wildly-on-ceasefire-news";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"gig-economy-india-financial-guide.mdx": {
	id: "gig-economy-india-financial-guide.mdx";
  slug: "gig-economy-india-financial-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"goal-based-investing-guide-india.mdx": {
	id: "goal-based-investing-guide-india.mdx";
  slug: "goal-based-investing-guide-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"health-insurance-for-young-adults-india.mdx": {
	id: "health-insurance-for-young-adults-india.mdx";
  slug: "health-insurance-for-young-adults-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"how-to-analyze-a-stock-before-investing-indian-market.mdx": {
	id: "how-to-analyze-a-stock-before-investing-indian-market.mdx";
  slug: "how-to-analyze-a-stock-before-investing-indian-market";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"how-to-build-one-lakh-emergency-fund-india.mdx": {
	id: "how-to-build-one-lakh-emergency-fund-india.mdx";
  slug: "how-to-build-one-lakh-emergency-fund-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"how-to-start-investing-in-stocks-india-beginners-guide.mdx": {
	id: "how-to-start-investing-in-stocks-india-beginners-guide.mdx";
  slug: "how-to-start-investing-in-stocks-india-beginners-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"how-trading-works-indian-stock-market-day-3.mdx": {
	id: "how-trading-works-indian-stock-market-day-3.mdx";
  slug: "how-trading-works-indian-stock-market-day-3";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"indian-markets-rebound-us-tariff-ruling-may-29-2025.mdx": {
	id: "indian-markets-rebound-us-tariff-ruling-may-29-2025.mdx";
  slug: "indian-markets-rebound-us-tariff-ruling-may-29-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"indian-stock-market-participants-regulators-t1-cycle.mdx": {
	id: "indian-stock-market-participants-regulators-t1-cycle.mdx";
  slug: "indian-stock-market-participants-regulators-t1-cycle";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"indian-stock-market-structure-participants-day-2.mdx": {
	id: "indian-stock-market-structure-participants-day-2.mdx";
  slug: "indian-stock-market-structure-participants-day-2";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"investing-in-yourself-your-best-investment-is-your-own-skills.mdx": {
	id: "investing-in-yourself-your-best-investment-is-your-own-skills.mdx";
  slug: "investing-in-yourself-your-best-investment-is-your-own-skills";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"investing-styles-value-growth-dividend.mdx": {
	id: "investing-styles-value-growth-dividend.mdx";
  slug: "investing-styles-value-growth-dividend";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"investing-vs-trading-different-approaches.mdx": {
	id: "investing-vs-trading-different-approaches.mdx";
  slug: "investing-vs-trading-different-approaches";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"itc-bat-stake-sale-market-impact-may-28-2025.mdx": {
	id: "itc-bat-stake-sale-market-impact-may-28-2025.mdx";
  slug: "itc-bat-stake-sale-market-impact-may-28-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"key-financial-ratios-for-investors-india.mdx": {
	id: "key-financial-ratios-for-investors-india.mdx";
  slug: "key-financial-ratios-for-investors-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"margin-trading-leverage-indian-stock-market-guide.mdx": {
	id: "margin-trading-leverage-indian-stock-market-guide.mdx";
  slug: "margin-trading-leverage-indian-stock-market-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"market-meltdown-sensex-nifty-june-12-2025.mdx": {
	id: "market-meltdown-sensex-nifty-june-12-2025.mdx";
  slug: "market-meltdown-sensex-nifty-june-12-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"markets-in-red-sensex-nifty-tumble-us-tariff-deadline.mdx": {
	id: "markets-in-red-sensex-nifty-tumble-us-tariff-deadline.mdx";
  slug: "markets-in-red-sensex-nifty-tumble-us-tariff-deadline";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"metal-stocks-trump-tariff-threat-june-2-2025.mdx": {
	id: "metal-stocks-trump-tariff-threat-june-2-2025.mdx";
  slug: "metal-stocks-trump-tariff-threat-june-2-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"mutual-funds-vs-etfs-explained.mdx": {
	id: "mutual-funds-vs-etfs-explained.mdx";
  slug: "mutual-funds-vs-etfs-explained";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"needs-vs-wants-conscious-spending-for-wealth.mdx": {
	id: "needs-vs-wants-conscious-spending-for-wealth.mdx";
  slug: "needs-vs-wants-conscious-spending-for-wealth";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"needs-vs-wants-the-simple-mindset-shift-that-will-make-you-rich.mdx": {
	id: "needs-vs-wants-the-simple-mindset-shift-that-will-make-you-rich.mdx";
  slug: "needs-vs-wants-the-simple-mindset-shift-that-will-make-you-rich";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"new-stock-market-trends-india.mdx": {
	id: "new-stock-market-trends-india.mdx";
  slug: "new-stock-market-trends-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"nifty-crosses-25000-sensex-soars-market-rallies-on-positive-cues.mdx": {
	id: "nifty-crosses-25000-sensex-soars-market-rallies-on-positive-cues.mdx";
  slug: "nifty-crosses-25000-sensex-soars-market-rallies-on-positive-cues";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"nifty-sensex-rally-june-9-2025-rbi-global-cues.mdx": {
	id: "nifty-sensex-rally-june-9-2025-rbi-global-cues.mdx";
  slug: "nifty-sensex-rally-june-9-2025-rbi-global-cues";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"nps-guide-for-young-investors.mdx": {
	id: "nps-guide-for-young-investors.mdx";
  slug: "nps-guide-for-young-investors";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"nykaa-shares-tumble-after-block-deal.mdx": {
	id: "nykaa-shares-tumble-after-block-deal.mdx";
  slug: "nykaa-shares-tumble-after-block-deal";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"options-strategies-guide-indian-investors.mdx": {
	id: "options-strategies-guide-indian-investors.mdx";
  slug: "options-strategies-guide-indian-investors";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"primary-market-ipo-guide-india.mdx": {
	id: "primary-market-ipo-guide-india.mdx";
  slug: "primary-market-ipo-guide-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"public-provident-fund-ppf-guide-india.mdx": {
	id: "public-provident-fund-ppf-guide-india.mdx";
  slug: "public-provident-fund-ppf-guide-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"rbi-surprise-rate-cut-fuels-market-rally-june-7-2025.mdx": {
	id: "rbi-surprise-rate-cut-fuels-market-rally-june-7-2025.mdx";
  slug: "rbi-surprise-rate-cut-fuels-market-rally-june-7-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"reits-and-invits-real-estate-infrastructure-investing-guide.mdx": {
	id: "reits-and-invits-real-estate-infrastructure-investing-guide.mdx";
  slug: "reits-and-invits-real-estate-infrastructure-investing-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"risk-management-techniques-for-stock-investors-india.mdx": {
	id: "risk-management-techniques-for-stock-investors-india.mdx";
  slug: "risk-management-techniques-for-stock-investors-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sebi-approves-fno-expiry-swap-nse-tuesday-bse-thursday.mdx": {
	id: "sebi-approves-fno-expiry-swap-nse-tuesday-bse-thursday.mdx";
  slug: "sebi-approves-fno-expiry-swap-nse-tuesday-bse-thursday";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sebis-t0-settlement-what-it-means-for-indian-investors.mdx": {
	id: "sebis-t0-settlement-what-it-means-for-indian-investors.mdx";
  slug: "sebis-t0-settlement-what-it-means-for-indian-investors";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sensex-breaches-84000-decoding-market-rally-drivers.mdx": {
	id: "sensex-breaches-84000-decoding-market-rally-drivers.mdx";
  slug: "sensex-breaches-84000-decoding-market-rally-drivers";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sensex-nifty-flat-volatile-trade-june-10-2025.mdx": {
	id: "sensex-nifty-flat-volatile-trade-june-10-2025.mdx";
  slug: "sensex-nifty-flat-volatile-trade-june-10-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sensex-snaps-4-day-rally-profit-booking.mdx": {
	id: "sensex-snaps-4-day-rally-profit-booking.mdx";
  slug: "sensex-snaps-4-day-rally-profit-booking";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sensex-surges-1000-points-nifty-tops-25500.mdx": {
	id: "sensex-surges-1000-points-nifty-tops-25500.mdx";
  slug: "sensex-surges-1000-points-nifty-tops-25500";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"short-selling-guide-india.mdx": {
	id: "short-selling-guide-india.mdx";
  slug: "short-selling-guide-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"siemens-energy-dalal-street-debut-volatile-start-power-titan.mdx": {
	id: "siemens-energy-dalal-street-debut-volatile-start-power-titan.mdx";
  slug: "siemens-energy-dalal-street-debut-volatile-start-power-titan";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"sips-for-beginners-how-to-start-your-first-systematic-investment-plan.mdx": {
	id: "sips-for-beginners-how-to-start-your-first-systematic-investment-plan.mdx";
  slug: "sips-for-beginners-how-to-start-your-first-systematic-investment-plan";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-101-investing-journey-day-1.mdx": {
	id: "stock-market-101-investing-journey-day-1.mdx";
  slug: "stock-market-101-investing-journey-day-1";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-basics-a-beginners-guide-to-investing-in-india.mdx": {
	id: "stock-market-basics-a-beginners-guide-to-investing-in-india.mdx";
  slug: "stock-market-basics-a-beginners-guide-to-investing-in-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-basics-day-10-risk-portfolio-management.mdx": {
	id: "stock-market-basics-day-10-risk-portfolio-management.mdx";
  slug: "stock-market-basics-day-10-risk-portfolio-management";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-taxation-guide-india-2025.mdx": {
	id: "stock-market-taxation-guide-india-2025.mdx";
  slug: "stock-market-taxation-guide-india-2025";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-market-terms-for-beginners.mdx": {
	id: "stock-market-terms-for-beginners.mdx";
  slug: "stock-market-terms-for-beginners";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"stock-valuation-methods-simplified.mdx": {
	id: "stock-valuation-methods-simplified.mdx";
  slug: "stock-valuation-methods-simplified";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"student-loan-repayment-guide-india.mdx": {
	id: "student-loan-repayment-guide-india.mdx";
  slug: "student-loan-repayment-guide-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"tech-revolution-indian-trading-investing.mdx": {
	id: "tech-revolution-indian-trading-investing.mdx";
  slug: "tech-revolution-indian-trading-investing";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"term-life-insurance-india-guide.mdx": {
	id: "term-life-insurance-india-guide.mdx";
  slug: "term-life-insurance-india-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"understanding-inflation-and-how-to-protect-your-savings-in-india.mdx": {
	id: "understanding-inflation-and-how-to-protect-your-savings-in-india.mdx";
  slug: "understanding-inflation-and-how-to-protect-your-savings-in-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"understanding-stock-market-indices-sensex-nifty.mdx": {
	id: "understanding-stock-market-indices-sensex-nifty.mdx";
  slug: "understanding-stock-market-indices-sensex-nifty";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"upi-wallets-net-banking-safe-digital-transactions-guide-india.mdx": {
	id: "upi-wallets-net-banking-safe-digital-transactions-guide-india.mdx";
  slug: "upi-wallets-net-banking-safe-digital-transactions-guide-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"upstox-review-products-pricing-services.mdx": {
	id: "upstox-review-products-pricing-services.mdx";
  slug: "upstox-review-products-pricing-services";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"upstox-vs-zerodha-vs-groww-2025-broker-comparison.mdx": {
	id: "upstox-vs-zerodha-vs-groww-2025-broker-comparison.mdx";
  slug: "upstox-vs-zerodha-vs-groww-2025-broker-comparison";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"vedanta-q1-fy26-production-update-analysis.mdx": {
	id: "vedanta-q1-fy26-production-update-analysis.mdx";
  slug: "vedanta-q1-fy26-production-update-analysis";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"ways-to-invest-in-indian-stock-market.mdx": {
	id: "ways-to-invest-in-indian-stock-market.mdx";
  slug: "ways-to-invest-in-indian-stock-market";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"what-is-pe-ratio-a-beginners-guide-to-valuing-stocks.mdx": {
	id: "what-is-pe-ratio-a-beginners-guide-to-valuing-stocks.mdx";
  slug: "what-is-pe-ratio-a-beginners-guide-to-valuing-stocks";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"what-is-short-selling-a-complete-guide-for-indian-investors.mdx": {
	id: "what-is-short-selling-a-complete-guide-for-indian-investors.mdx";
  slug: "what-is-short-selling-a-complete-guide-for-indian-investors";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"what-is-sip-rupee-cost-averaging-guide.mdx": {
	id: "what-is-sip-rupee-cost-averaging-guide.mdx";
  slug: "what-is-sip-rupee-cost-averaging-guide";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"what-moves-stock-prices-india.mdx": {
	id: "what-moves-stock-prices-india.mdx";
  slug: "what-moves-stock-prices-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"your-first-credit-card-guide-india.mdx": {
	id: "your-first-credit-card-guide-india.mdx";
  slug: "your-first-credit-card-guide-india";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
"zee-promoters-inject-2237-crore-boost-stake-post-sony-fallout.mdx": {
	id: "zee-promoters-inject-2237-crore-boost-stake-post-sony-fallout.mdx";
  slug: "zee-promoters-inject-2237-crore-boost-stake-post-sony-fallout";
  body: string;
  collection: "posts";
  data: InferEntrySchema<"posts">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
