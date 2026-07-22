// TermsAndConditions.jsx
import React from "react";

const RefundPolicy = () => {
  return (
    <div className="pt-24 pb-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Refund Policy</h1>
            <p className="text-sm text-gray-500">Last updated: January 13, 2026</p>
          </div>
          <div>
            {/* <button
              type="button"
              onClick={() => window.history.back()}
              className="text-sm px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
            >
              Back
            </button> */}
          </div>
        </div>

 <section className="prose prose-sm sm:prose lg:prose-lg text-gray-800">
  <h2>Refund Policy</h2>

  <p>
    VOC Academy appreciates and values your purchase on our website (
    https://www.vocacademics.com/). We take our refund policy seriously
    and request that you read it carefully. All defined terms used below
    shall have the meanings set forth in our Terms and Conditions. Please
    refer to https://www.vocacademics.com/terms-and-conditions/.
  </p>

  <p>
    VOC Academy (hereby referred to as <strong>"VOC Academy"</strong>)
    reserves the sole right to cancel, postpone, or reschedule a training
    program or change the trainer due to insufficient enrollments,
    trainer/instructor unavailability, or force majeure conditions.
  </p>

  <strong>
    Refund Policy in Case Training is Cancelled by VOC Academy
  </strong>

  <p>
    In case VOC Academy cancels an event, 100% of the course fee will be
    refunded to the delegate, provided the refund request is raised within
    10 days of purchasing the course.
  </p>

  <strong>If the Delegate Opts for Cancellation/Refund</strong>

  <p>
    Delegates should raise the refund request within 3 business days after
    attending the first session (Classroom/Instructor-Led Online). A formal
    refund request must be sent via official email to{" "}
    <strong>connect@vocacademics.com</strong> from the course commencement
    date. Refund requests received after this period will not be entertained.
  </p>

  <p>
    No refund will be entertained under any circumstances if the
    delegate/participant has attended 8 hours or more of the training
    session.
  </p>

  <p>
    If the delegate/participant has not attended even a single live session,
    the refund request must be raised within 10 days from the date of
    payment. Requests received after this period will not be entertained.
  </p>

  <ul>
    <li>
      All approved refunds will be processed within <strong>10–20 business
      working days</strong> after deducting applicable taxes.
    </li>

    <li>
      Any duplicate payment will be refunded only after the delegate raises
      a request along with valid payment proof. Such refunds are generally
      processed within <strong>7 business days</strong> from the date of
      intimation.
    </li>

    <li>
      If the participant/delegate has accessed any e-learning course,
      attended online classroom sessions, or received course recordings,
      the refund request will not be entertained.
    </li>
  </ul>

  <p>
    If you have any questions regarding our refund or rescheduling policy,
    please email us at{" "}
    <strong>connect@vocacademics.com</strong>.
  </p>
</section>
        </div>
      </div>
  );
};

export default RefundPolicy;