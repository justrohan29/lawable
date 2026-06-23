"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { MOCK_MENTORS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Plus, CheckCircle, Star, Camera } from "lucide-react";
import { toast } from "sonner";

export default function MentorProfilePage() {
  const { user } = useAuth();
  const mentor = MOCK_MENTORS.find((m) => m.id === "m1")!;
  const [expertise, setExpertise] = useState(mentor.expertise);
  const [newExpertise, setNewExpertise] = useState("");
  const [bio, setBio] = useState(mentor.bio);
  const [saving, setSaving] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  const addExpertise = () => {
    if (!newExpertise.trim() || expertise.includes(newExpertise.trim())) return;
    setExpertise(prev => [...prev, newExpertise.trim()]);
    setNewExpertise("");
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success("Mentor profile updated!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mentor Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Your profile is visible to all students on Lawable</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card preview */}
        <Card className="border-0 shadow-sm lg:col-span-1">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="gradient-brand text-white text-3xl font-bold">
                  {mentor.name.split(" ").pop()?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button onClick={() => photoRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center shadow-sm hover:bg-gray-50">
                <Camera className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden"
                onChange={() => toast.success("Photo updated!")} />
            </div>
            <div className="font-semibold text-gray-900">{mentor.name}</div>
            <div className="text-sm text-gray-500">{mentor.designation}</div>
            <div className="text-sm text-indigo-600 font-medium">{mentor.organization}</div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-gray-700">{mentor.rating}</span>
              <span className="text-sm text-gray-400">({mentor.totalSessions} sessions)</span>
            </div>
            <Badge className="mt-2 bg-emerald-50 text-emerald-700 border-emerald-200">
              <CheckCircle className="w-3 h-3 mr-1" /> Verified Mentor
            </Badge>
          </CardContent>
        </Card>

        {/* Edit form */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Professional Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-700">Full Name</Label>
                  <Input defaultValue={mentor.name} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm text-gray-700">Designation</Label>
                  <Input defaultValue={mentor.designation} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm text-gray-700">Organization</Label>
                  <Input defaultValue={mentor.organization} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm text-gray-700">Years of Experience</Label>
                  <Input type="number" defaultValue={mentor.experience} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm text-gray-700">City</Label>
                  <Input defaultValue={mentor.city} className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm text-gray-700">Email</Label>
                  <Input value={user?.email} readOnly className="mt-1.5 bg-gray-50" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base">Bio</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="resize-none"
                placeholder="Tell students about your experience and how you can help them..." />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base">Areas of Expertise</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {expertise.map(e => (
                  <Badge key={e} className="gap-1.5 bg-purple-50 text-purple-700 border-purple-200">
                    {e}
                    <button onClick={() => setExpertise(prev => prev.filter(x => x !== e))}
                      className="hover:text-red-600 ml-0.5"><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newExpertise} onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add expertise area" className="flex-1"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExpertise(); } }} />
                <Button variant="outline" size="sm" onClick={addExpertise} className="gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="gradient-brand text-white border-0 px-8">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
