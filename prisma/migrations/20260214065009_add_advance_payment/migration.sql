-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('FULL', 'ADVANCE');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "advanceAmount" INTEGER,
ADD COLUMN     "balanceAmount" INTEGER,
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'FULL';
