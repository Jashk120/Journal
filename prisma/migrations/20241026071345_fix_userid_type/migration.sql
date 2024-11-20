-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "coverImage" TEXT,
    "isVerified" BOOLEAN NOT NULL,
    "age" INTEGER,
    "verifyCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verifyCodeExp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "exitDateTime" TIMESTAMP(3),
    "hoursHeld" DOUBLE PRECISION NOT NULL,
    "stars" INTEGER NOT NULL,
    "pair" TEXT NOT NULL,
    "tradeType" TEXT NOT NULL,
    "lotSize" DOUBLE PRECISION NOT NULL,
    "entryPrice" DOUBLE PRECISION NOT NULL,
    "takeProfit" DOUBLE PRECISION,
    "stopLoss" DOUBLE PRECISION,
    "tpDollars" DOUBLE PRECISION NOT NULL,
    "slDollars" DOUBLE PRECISION NOT NULL,
    "actualExit" DOUBLE PRECISION,
    "actualProfitLoss" DOUBLE PRECISION NOT NULL,
    "quickRationale" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
