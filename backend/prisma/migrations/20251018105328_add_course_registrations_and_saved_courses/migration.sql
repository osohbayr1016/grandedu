-- CreateTable
CREATE TABLE "public"."CourseRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavedCourse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CourseRegistration_userId_idx" ON "public"."CourseRegistration"("userId");

-- CreateIndex
CREATE INDEX "CourseRegistration_courseId_idx" ON "public"."CourseRegistration"("courseId");

-- CreateIndex
CREATE INDEX "CourseRegistration_status_idx" ON "public"."CourseRegistration"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CourseRegistration_userId_courseId_key" ON "public"."CourseRegistration"("userId", "courseId");

-- CreateIndex
CREATE INDEX "SavedCourse_userId_idx" ON "public"."SavedCourse"("userId");

-- CreateIndex
CREATE INDEX "SavedCourse_courseId_idx" ON "public"."SavedCourse"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCourse_userId_courseId_key" ON "public"."SavedCourse"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "public"."CourseRegistration" ADD CONSTRAINT "CourseRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseRegistration" ADD CONSTRAINT "CourseRegistration_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedCourse" ADD CONSTRAINT "SavedCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedCourse" ADD CONSTRAINT "SavedCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
