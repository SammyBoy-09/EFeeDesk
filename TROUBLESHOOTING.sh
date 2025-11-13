#!/bin/bash
# Troubleshooting Guide for EFeeDesk Connection Issues

# 1. Test if your phone can reach your PC
echo "Testing connectivity to PC at 130.1.55.136..."
ping -c 4 130.1.55.136

# 2. Test if port 5000 is reachable
echo ""
echo "Testing port 5000..."
nc -zv 130.1.55.136 5000

# 3. Try to fetch API response
echo ""
echo "Testing API..."
curl -v http://130.1.55.136:5000

# 4. Check your phone's network configuration
echo ""
echo "Your network info:"
ifconfig
