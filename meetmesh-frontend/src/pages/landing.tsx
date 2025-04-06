"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { MapPin, MessageSquare, Users, Shield, Zap, ChevronRight, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { useToast } from "@/components/ui/use-toast"

export default function Landing() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
//   const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // toast({
    //   title: "You're on the list!",
    //   description: "Thanks for joining our waiting list. We'll be in touch soon!",
    // })

    setEmail("")
    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MapChat</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </a>
            <a href="#faq" className="text-sm font-medium hover:text-primary">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Connect with people <span className="text-primary">near you</span> in real-time
              </h1>
              <p className="mb-10 text-xl text-muted-foreground">
                MapChat helps you discover and chat with people around you. Whether you're traveling, exploring a new
                city, or just curious about your neighborhood.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a href="#waiting-list">
                  <Button size="lg" className="gap-2">
                    Join the waiting list
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </a>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg">
                    See how it works
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -top-40 left-0 right-0 z-0 opacity-10">
            <div className="h-[600px] w-full bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_65%)]"></div>
          </div>
        </section>

        {/* App Preview */}
        <section className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border bg-background shadow-xl">
              <div className="aspect-[16/9] w-full bg-gray-100">
                {/* This would be a screenshot or mockup of the app */}
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="text-center">
                    <MapPin className="mx-auto h-16 w-16 text-primary/60" />
                    <p className="mt-4 text-xl font-medium">App Preview</p>
                    <p className="text-muted-foreground">Interactive map with real-time chat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose MapChat?</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Our platform combines location-based discovery with instant messaging to create meaningful connections
                wherever you are.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Location-Based Discovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    See who's around you in real-time on an interactive map. Discover new people in your vicinity with
                    similar interests.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Instant Messaging</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start conversations with a simple click. Our real-time messaging system lets you connect instantly
                    with people nearby.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Privacy Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You're in control of your visibility. Choose when to appear on the map and who can contact you with
                    our advanced privacy settings.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Community Building</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create and join local communities based on shared interests, activities, or neighborhoods to expand
                    your social circle.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Real-Time Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    See people move on the map in real-time. Get instant notifications when someone new appears nearby
                    or messages you.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Cross-Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access MapChat from any device. Our platform works seamlessly across desktop, mobile web, and native
                    apps (coming soon).
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-muted py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">How MapChat Works</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Getting started with MapChat is easy. Follow these simple steps to begin connecting with people around
                you.
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-border md:left-1/2"></div>

                <div className="mb-12 md:mb-0">
                  <div className="relative md:ml-[50%] md:pl-12">
                    <div className="absolute left-0 top-6 z-10 -ml-[7px] h-3.5 w-3.5 rounded-full bg-primary md:-ml-[8px]"></div>
                    <div className="relative mb-8 rounded-lg border bg-background p-6 shadow-sm md:mr-[50%]">
                      <h3 className="mb-2 text-xl font-bold">1. Create Your Account</h3>
                      <p className="text-muted-foreground">
                        Sign up with your email or social accounts. Set up your profile with a photo and some
                        information about yourself.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-12 md:mb-0">
                  <div className="relative md:mr-[50%] md:pr-12">
                    <div className="absolute right-0 top-6 z-10 -mr-[7px] h-3.5 w-3.5 rounded-full bg-primary md:-mr-[8px]"></div>
                    <div className="relative mb-8 rounded-lg border bg-background p-6 shadow-sm md:ml-[50%]">
                      <h3 className="mb-2 text-xl font-bold">2. Explore the Map</h3>
                      <p className="text-muted-foreground">
                        Open the interactive map to see other users around your location. Browse profiles and discover
                        people with similar interests.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-12 md:mb-0">
                  <div className="relative md:ml-[50%] md:pl-12">
                    <div className="absolute left-0 top-6 z-10 -ml-[7px] h-3.5 w-3.5 rounded-full bg-primary md:-ml-[8px]"></div>
                    <div className="relative mb-8 rounded-lg border bg-background p-6 shadow-sm md:mr-[50%]">
                      <h3 className="mb-2 text-xl font-bold">3. Connect & Chat</h3>
                      <p className="text-muted-foreground">
                        Click on a user's icon to view their profile and start a conversation. Exchange messages in
                        real-time and make new connections.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative md:mr-[50%] md:pr-12">
                    <div className="absolute right-0 top-6 z-10 -mr-[7px] h-3.5 w-3.5 rounded-full bg-primary md:-mr-[8px]"></div>
                    <div className="relative mb-8 rounded-lg border bg-background p-6 shadow-sm md:ml-[50%]">
                      <h3 className="mb-2 text-xl font-bold">4. Build Your Network</h3>
                      <p className="text-muted-foreground">
                        Add people to your contacts, join local communities, and participate in nearby events to expand
                        your social circle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">What Our Beta Users Say</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Early adopters are already loving the MapChat experience. Here's what they have to say.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10">{/* User avatar would go here */}</div>
                    <div>
                      <CardTitle className="text-base">Sarah K.</CardTitle>
                      <CardDescription>Travel Enthusiast</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "MapChat has completely changed how I meet people while traveling. I've made amazing connections
                    with locals who showed me hidden gems I would have never found otherwise!"
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10">{/* User avatar would go here */}</div>
                    <div>
                      <CardTitle className="text-base">Michael T.</CardTitle>
                      <CardDescription>Student</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "As a new student in town, MapChat helped me find study buddies in my area. The location-based
                    discovery made it so easy to connect with people from my university who live nearby."
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10">{/* User avatar would go here */}</div>
                    <div>
                      <CardTitle className="text-base">Elena R.</CardTitle>
                      <CardDescription>Remote Worker</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    "Working remotely can be isolating, but MapChat has helped me find other remote workers in cafés
                    around me. We've formed a little community and often work together!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Waiting List */}
        <section id="waiting-list" className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Join Our Waiting List</h2>
              <p className="mb-8 text-lg text-primary-foreground/80">
                Be among the first to experience MapChat when we launch. Sign up for early access and get the chance to
                participate in our beta testing program.
              </p>

              <Card className="mx-auto max-w-md bg-white text-foreground">
                <CardHeader>
                  <CardTitle>Get Early Access</CardTitle>
                  <CardDescription>
                    Enter your email to join our waiting list and receive updates about our launch.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="mr-2">Submitting</span>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        </>
                      ) : (
                        <>
                          Join Waiting List
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </CardFooter>
              </Card>

              <div className="mt-12 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 md:grid-cols-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary-foreground" />
                  <div>
                    <h3 className="font-medium">Early Access</h3>
                    <p className="text-sm text-primary-foreground/80">Be the first to try MapChat</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary-foreground" />
                  <div>
                    <h3 className="font-medium">Beta Testing</h3>
                    <p className="text-sm text-primary-foreground/80">Help shape the future of the app</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary-foreground" />
                  <div>
                    <h3 className="font-medium">Exclusive Updates</h3>
                    <p className="text-sm text-primary-foreground/80">Get development news first</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Have questions about MapChat? Find answers to the most common questions below.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>When will MapChat be available?</AccordionTrigger>
                  <AccordionContent>
                    We're currently in the final stages of development and plan to launch a beta version in the next few
                    months. Join our waiting list to be notified when we launch and get early access.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is MapChat free to use?</AccordionTrigger>
                  <AccordionContent>
                    Yes, MapChat will be free to use with all core features available to everyone. We plan to introduce
                    premium features in the future, but the basic functionality will always remain free.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How does MapChat protect my privacy?</AccordionTrigger>
                  <AccordionContent>
                    Your privacy is our top priority. You have complete control over your visibility on the map, and you
                    can choose to be visible to everyone, only to friends, or completely hidden. We also never share
                    your exact location, only a general area.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Which platforms will MapChat support?</AccordionTrigger>
                  <AccordionContent>
                    MapChat will be available as a web application at launch, accessible from any device with a modern
                    browser. We're also developing native mobile apps for iOS and Android that will be released shortly
                    after the initial launch.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How can I become a beta tester?</AccordionTrigger>
                  <AccordionContent>
                    When you join our waiting list, you'll have the option to indicate your interest in beta testing.
                    We'll select a diverse group of users from different locations and backgrounds to participate in our
                    beta program.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>Is there a referral program?</AccordionTrigger>
                  <AccordionContent>
                    We're planning to implement a referral program after our official launch. Beta testers and early
                    adopters will receive special referral bonuses and rewards for inviting friends to join MapChat.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">MapChat</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Connect with people near you in real-time. Discover, chat, and build meaningful connections.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-muted-foreground hover:text-foreground">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Data Processing
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} MapChat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

