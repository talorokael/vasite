-- AlterTable
ALTER TABLE "orders"
ADD COLUMN "waybillNumber" TEXT,
ADD COLUMN "labelUrl" TEXT,
ADD COLUMN "carrier" TEXT,
ADD COLUMN "shipmentStatus" TEXT,
ADD COLUMN "trackingHistory" JSONB;

-- CreateIndex
CREATE INDEX "orders_trackingNumber_idx" ON "orders"("trackingNumber");