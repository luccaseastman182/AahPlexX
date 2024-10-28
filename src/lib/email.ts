interface EmailOptions {
  email: string;
  resetLink: string;
}

class EmailDeliveryService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  private static async sendEmail(options: EmailOptions, attempt = 1): Promise<void> {
    try {
      // Implementation would integrate with your email service provider
      // Example using a hypothetical email service:
      await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: options.email,
          template: 'password-reset',
          data: {
            resetLink: options.resetLink,
            expiresIn: '1 hour',
          },
        }),
      });
    } catch (error) {
      if (attempt < this.MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempt));
        return this.sendEmail(options, attempt + 1);
      }
      throw error;
    }
  }

  static async sendPasswordResetEmail(options: EmailOptions): Promise<void> {
    return this.sendEmail(options);
  }
}

export { EmailDeliveryService };