import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col gap-6 p-6">
                    {/* Page Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your account settings and preferences.
                        </p>
                    </div>
                    
                    <Separator />

                    {/* Cards Grid */}
                    <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
                        {/* Personal Information Card */}
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Update your personal details here.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/avatars/shadcn.jpg" alt="Profile picture" />
                                        <AvatarFallback className="text-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm font-medium">Profile Picture</p>
                                        <Button variant="outline" size="sm">
                                            Change Avatar
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            Full Name
                                        </Label>
                                        <Input 
                                            id="name" 
                                            placeholder="Enter your full name"
                                            defaultValue="shadcn"
                                            className="h-10"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            Email Address
                                        </Label>
                                        <Input 
                                            id="email" 
                                            type="email"
                                            placeholder="your@email.com"
                                            defaultValue="m@example.com"
                                            className="h-10"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-sm font-medium">
                                            Role
                                        </Label>
                                        <Input 
                                            id="role" 
                                            defaultValue="Administrator" 
                                            disabled 
                                            className="h-10 bg-muted"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Contact your admin to change your role
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>

                        {/* Security Card */}
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                                <CardDescription>
                                    Manage your password and security settings.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password" className="text-sm font-medium">
                                        Current Password
                                    </Label>
                                    <Input 
                                        id="current-password" 
                                        type="password"
                                        placeholder="Enter current password"
                                        className="h-10"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="new-password" className="text-sm font-medium">
                                        New Password
                                    </Label>
                                    <Input 
                                        id="new-password" 
                                        type="password"
                                        placeholder="Enter new password"
                                        className="h-10"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Must be at least 8 characters
                                    </p>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-sm font-medium">
                                        Confirm New Password
                                    </Label>
                                    <Input 
                                        id="confirm-password" 
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="h-10"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button>Update Password</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}