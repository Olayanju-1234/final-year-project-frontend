import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MessageSquare, Calendar, Send, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { communicationApi } from '@/src/lib/communicationApi';
import { convertBackendToFrontend } from '@/src/utils/typeConversion';
import type { IMessage, IViewing, PopulatedMessage, PopulatedViewing, IUser, IProperty } from '@/src/types';

interface MessageCenterProps {
  userId: string;
  userType: 'tenant' | 'landlord';
}

export const MessageCenter: React.FC<MessageCenterProps> = ({
  userId,
  userType,
}) => {
  const [messages, setMessages] = useState<PopulatedMessage[]>([]);
  const [sentMessages, setSentMessages] = useState<PopulatedMessage[]>([]);
  const [viewings, setViewings] = useState<PopulatedViewing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<PopulatedMessage | null>(null);
  const [selectedViewing, setSelectedViewing] = useState<PopulatedViewing | null>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showViewingDialog, setShowViewingDialog] = useState(false);
  const [newMessage, setNewMessage] = useState({
    toUserId: '',
    subject: '',
    message: '',
    messageType: 'general' as const,
  });
  const [newViewing, setNewViewing] = useState({
    propertyId: '',
    requestedDate: '',
    requestedTime: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, [userId, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeTab === 'inbox') {
        const response = await communicationApi.getInbox();
        if (response.success) {
          const convertedMessages = response.data?.map((msg: any) => convertBackendToFrontend.message(msg)) || [];
          setMessages(convertedMessages);
        }
      } else if (activeTab === 'sent') {
        const response = await communicationApi.getSentMessages();
        if (response.success) {
          const convertedMessages = response.data?.map((msg: any) => convertBackendToFrontend.message(msg)) || [];
          setSentMessages(convertedMessages);
        }
      } else if (activeTab === 'viewings') {
        const response = await communicationApi.getViewings(undefined, undefined, undefined, userType);
        if (response.success) {
          const convertedViewings = response.data?.map((viewing: any) => convertBackendToFrontend.viewing(viewing)) || [];
          setViewings(convertedViewings);
        }
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.toUserId || !newMessage.subject || !newMessage.message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await communicationApi.sendMessage(newMessage);
      if (response.success) {
        setShowSendDialog(false);
        setNewMessage({ toUserId: '', subject: '', message: '', messageType: 'general' });
        loadData();
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const requestViewing = async () => {
    if (!newViewing.propertyId || !newViewing.requestedDate || !newViewing.requestedTime) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await communicationApi.requestViewing(newViewing);
      if (response.success) {
        setShowViewingDialog(false);
        setNewViewing({ propertyId: '', requestedDate: '', requestedTime: '', notes: '' });
        loadData();
      }
    } catch (err) {
      setError('Failed to request viewing. Please try again.');
      console.error('Error requesting viewing:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateViewingStatus = async (viewingId: string, status: string, notes?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await communicationApi.updateViewingStatus(viewingId, status as any, notes);
      if (response.success) {
        loadData();
      }
    } catch (err) {
      setError('Failed to update viewing status. Please try again.');
      console.error('Error updating viewing status:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await communicationApi.markAsRead(messageId);
      loadData();
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserDisplayName = (user: IUser | string) => {
    if (typeof user === 'string') {
      return 'Unknown User';
    }
    return user.name || user.email || 'Unknown User';
  };

  const getPropertyDisplayName = (property: IProperty | string) => {
    if (typeof property === 'string') {
      return 'Unknown Property';
    }
    return property.title || 'Unknown Property';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Communication Center
          </CardTitle>
          <CardDescription>
            Manage messages and property viewing requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inbox">
                Inbox ({messages.filter(m => m.status === 'sent').length})
              </TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="viewings">
                Viewings ({viewings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Inbox</h3>
                <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      New Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send New Message</DialogTitle>
                      <DialogDescription>
                        Send a message to another user
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="toUserId">To User ID</Label>
                        <Input
                          id="toUserId"
                          value={newMessage.toUserId}
                          onChange={(e) => setNewMessage({ ...newMessage, toUserId: e.target.value })}
                          placeholder="Enter user ID"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={newMessage.subject}
                          onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                          placeholder="Enter subject"
                        />
                      </div>
                      <div>
                        <Label htmlFor="messageType">Message Type</Label>
                        <Select
                          value={newMessage.messageType}
                          onValueChange={(value) => setNewMessage({ ...newMessage, messageType: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="inquiry">Property Inquiry</SelectItem>
                            <SelectItem value="viewing_request">Viewing Request</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={newMessage.message}
                          onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                          placeholder="Enter your message"
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowSendDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={sendMessage} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Send Message
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <Alert>
                  <AlertDescription>No messages in your inbox.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <Card 
                      key={message._id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        message.status === 'sent' ? 'border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (message.status === 'sent') {
                          markAsRead(message._id);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{message.messageType}</Badge>
                              <Badge className={message.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                                {message.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold">{message.subject}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              From: {getUserDisplayName(message.fromUserId)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {message.message.substring(0, 100)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              <h3 className="text-lg font-semibold">Sent Messages</h3>
              
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading sent messages...</span>
                </div>
              ) : sentMessages.length === 0 ? (
                <Alert>
                  <AlertDescription>No sent messages.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {sentMessages.map((message) => (
                    <Card key={message._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{message.messageType}</Badge>
                              <Badge className="bg-gray-100 text-gray-800">
                                {message.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold">{message.subject}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              To: {getUserDisplayName(message.toUserId)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {message.message.substring(0, 100)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="viewings" className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Property Viewings</h3>
                {userType === 'tenant' && (
                  <Dialog open={showViewingDialog} onOpenChange={setShowViewingDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Request Viewing
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Property Viewing</DialogTitle>
                        <DialogDescription>
                          Schedule a viewing for a property
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="propertyId">Property ID</Label>
                          <Input
                            id="propertyId"
                            value={newViewing.propertyId}
                            onChange={(e) => setNewViewing({ ...newViewing, propertyId: e.target.value })}
                            placeholder="Enter property ID"
                          />
                        </div>
                        <div>
                          <Label htmlFor="requestedDate">Requested Date</Label>
                          <Input
                            id="requestedDate"
                            type="date"
                            value={newViewing.requestedDate}
                            onChange={(e) => setNewViewing({ ...newViewing, requestedDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="requestedTime">Requested Time</Label>
                          <Input
                            id="requestedTime"
                            value={newViewing.requestedTime}
                            onChange={(e) => setNewViewing({ ...newViewing, requestedTime: e.target.value })}
                            placeholder="e.g., 2:00 PM"
                          />
                        </div>
                        <div>
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            value={newViewing.notes}
                            onChange={(e) => setNewViewing({ ...newViewing, notes: e.target.value })}
                            placeholder="Any additional notes"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowViewingDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={requestViewing} disabled={loading}>
                          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Request Viewing
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading viewings...</span>
                </div>
              ) : viewings.length === 0 ? (
                <Alert>
                  <AlertDescription>No viewing requests found.</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {viewings.map((viewing) => (
                    <Card key={viewing._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(viewing.status)}
                              <Badge className={getStatusColor(viewing.status)}>
                                {viewing.status}
                              </Badge>
                            </div>
                            <h4 className="font-semibold">
                              Property: {getPropertyDisplayName(viewing.propertyId)}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Tenant: {getUserDisplayName(viewing.tenantId)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Date: {formatDate(viewing.requestedDate)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Time: {viewing.requestedTime}
                            </p>
                            {viewing.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Notes: {viewing.notes}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDate(viewing.createdAt)}
                            </p>
                          </div>
                          {userType === 'landlord' && viewing.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateViewingStatus(viewing._id, 'confirmed')}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateViewingStatus(viewing._id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      {selectedMessage && (
        <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
              <DialogDescription>
                {formatDate(selectedMessage.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>From</Label>
                <p className="text-sm">
                  {getUserDisplayName(selectedMessage.fromUserId)}
                </p>
              </div>
              <div>
                <Label>Message</Label>
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}; 