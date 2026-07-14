import { Star } from "lucide-react";

const Testimonials = ({ testimonials = [] }) => {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                        Trusted by Professionals Worldwide
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 sm:text-xl">
                        See what our users have to say about CloudShare
                    </p>
                </div>

                <div className="mt-16 grid gap-8 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <article
                            key={testimonial.name}
                            className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.avatarClass} text-sm font-bold text-white shadow-md`}>
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {testimonial.role}, {testimonial.company}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center gap-1 text-amber-400">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`h-5 w-5 ${index < testimonial.rating ? "fill-current" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>

                            <p className="mt-6 text-[17px] leading-8 text-gray-600 italic">
                                &quot;{testimonial.quote}&quot;
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;