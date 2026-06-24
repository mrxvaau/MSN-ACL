# Deployment Guide

Due to shared hosting thread/process limits on cPanel, we must build the Next.js application locally and upload the compiled `.next` folder.

Every time code changes, follow these steps to deploy:

1. **Build Locally**: Run the deployment script locally to build the app and package it:
   ```bash
   ./deploy.sh
   ```
   *This will run `npm run build` and generate a `next-build.zip` file.*

2. **Upload to Server**: 
   - Open cPanel File Manager (or use FTP).
   - Upload `next-build.zip` to `/home/msnaclco/MSN-ACL/`.

3. **Extract on Server**:
   - SSH into your cPanel server and run:
   ```bash
   cd /home/msnaclco/MSN-ACL
   unzip -o next-build.zip
   ```

4. **Restart the Node.js App**:
   - Go to cPanel → Setup Node.js App.
   - Click **Restart** for the MSN-ACL application.
