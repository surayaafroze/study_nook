"use client";
 
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client"; // adjust path
import {
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiPlus,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiX,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";