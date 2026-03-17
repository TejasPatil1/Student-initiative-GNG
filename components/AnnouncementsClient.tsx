"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Announcement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link?: string;
  created_at: string;
  is_active: boolean;
}

interface AnnouncementsClientProps {
  announcements: Announcement[];
}

export default function AnnouncementsClient({
  announcements,
}: AnnouncementsClientProps) {

  console.log("ANNOUNCEMENTS PROP:", announcements);

  if (!announcements || announcements.length === 0) {
    return (
      <div className="w-full py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">No announcements at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600 mb-8">
          Stay updated with the latest news and announcements from our community.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {announcement.image_url && (
                <div className="relative h-48 w-full">
                  <Image
                    src={announcement.image_url}
                    alt={announcement.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  {announcement.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {announcement.description}
                </p>
                {announcement.link && (
                  <a
                    href={announcement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    Learn More →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
