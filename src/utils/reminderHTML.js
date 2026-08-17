export const getBirthdayReminderHTML = ({ fullName, totalDonationAmt }) => {
  return `<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
  style="background-color:#f4f8f3; padding:30px 15px; font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td align="center">

      <table width="600" cellpadding="0" cellspacing="0" border="0"
        style="max-width:600px; width:100%; background-color:#ffffff; border-radius:10px;">

        <tr>
          <td style="padding:30px; color:#333333;">

            <h2 style="color:#2e7d32; margin:0 0 20px;">
              🎂 Advance Birthday Wishes, ${fullName}!
            </h2>

            <p style="font-size:16px; line-height:1.6; margin:0 0 15px;">
              Wishing you a very <strong>Happy Birthday in advance!</strong>
              May the year ahead bring you happiness, good health and success.
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 15px;">
              As you celebrate your special day tomorrow, why not make it
              even more meaningful by <strong>giving back to nature?</strong> 🌱
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 15px;">
              <strong style="font-size:20px; color:green">You have Donated:</strong> <strong style="font-size:20px; color:green">₹ ${totalDonationAmt}</strong>
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 15px;">
              A small contribution to <strong>Green Army Charitable Trust</strong>
              can help us plant and care for trees and create a greener tomorrow.
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 20px;">
              <strong>
                Celebrate your life by helping another life grow. 🌳
              </strong>
            </p>

            <table cellpadding="0" cellspacing="0" border="0" align="center">
              <tr>
                <td align="center" style="background-color:#2e7d32; border-radius:5px;">

                  <a href="{{donationLink}}"
                    style="display:inline-block; padding:12px 25px;
                    color:#ffffff; text-decoration:none;
                    font-size:15px; font-weight:bold;">
                    Make a Difference 🌱
                  </a>

                </td>
              </tr>
            </table>

            <p style="font-size:15px; line-height:1.6; color:#666666; margin:25px 0 0;">
              With warm wishes,<br>
              <strong style="color:#2e7d32;">
                Green Army Charitable Trust
              </strong>
            </p>

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>`;
};

export const getAnniversaryReminderHTML = ({ fullName, totalDonationAmt }) => {
  return `<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
  style="background-color:#f4f8f3; padding:30px 15px; font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td align="center">

      <table width="600" cellpadding="0" cellspacing="0" border="0"
        style="max-width:600px; width:100%; background-color:#ffffff; border-radius:10px;">

        <tr>
          <td style="padding:30px; color:#333333;">

            <h2 style="color:#558b2f; margin:0 0 20px;">
              💚 Advance Anniversary Wishes, ${fullName}!
            </h2>

            <p style="font-size:16px; line-height:1.6; margin:0 0 15px;">
              Wishing you a very <strong>Happy Anniversary in advance!</strong>
              May your journey together continue to grow with love,
              happiness and beautiful memories.
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 15px;">
              Tomorrow is a celebration of your journey together.
              Why not make it even more special by
              <strong>giving something back to nature?</strong> 🌱
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 15px;">
              <strong style="font-size:20px; color:green">You have Donated:</strong> <strong style="font-size:20px; color:green">₹ ${totalDonationAmt}</strong>
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 15px;">
              Your contribution to <strong>Green Army Charitable Trust</strong>
              can help plant and nurture trees for a greener future.
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 20px;">
              <strong>
                Celebrate your togetherness by growing something
                that lasts for generations. 🌳
              </strong>
            </p>

            <table cellpadding="0" cellspacing="0" border="0" align="center">
              <tr>
                <td align="center" style="background-color:#558b2f; border-radius:5px;">

                  <a href="{{donationLink}}"
                    style="display:inline-block; padding:12px 25px;
                    color:#ffffff; text-decoration:none;
                    font-size:15px; font-weight:bold;">
                    Make a Difference 🌱
                  </a>

                </td>
              </tr>
            </table>

            <p style="font-size:15px; line-height:1.6; color:#666666; margin:25px 0 0;">
              With warm wishes,<br>
              <strong style="color:#558b2f;">
                Green Army Charitable Trust
              </strong>
            </p>

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>`;
};

export const getWateringReminderHTML = (wateringLocations) => {
  const locationsListHtml = wateringLocations
    .map((item) => {
      const {plantation, previousSchedule, dueDays} = item;

      const previousCompleted = !!previousSchedule?.isCompleted;

      return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border:1px solid #dce8da; border-radius:8px; margin-bottom:15px;">

      <tr>
        <td style="padding:18px;">

          <h3 style="margin:0 0 12px; color:#2e7d32; font-size:18px;">
            ${plantation.locationName}${dueDays ? ' - <span style="color:red; font-size:15px;">(Due Since: 3 days)</span>' : ''}
          </h3>

          <p style="margin:6px 0; font-size:14px;">
            <strong>🌳 Plantation Date:</strong>
            ${plantation.plantationDate}
          </p>

          <p style="margin:6px 0; font-size:14px;">
            <strong>💧 Previous Watering:</strong>
            ${previousSchedule?.scheduledDate 
              ? (`${previousSchedule?.scheduledDate} - <span style="color:${previousCompleted ? 'green' : 'red'}; font-size:15px;">${previousCompleted ? 'Done' : 'pending'}</span>`)
              : "No previous watering"}
          </p>

          <p style="margin:6px 0; font-size:14px;">
            <strong>🔄 Frequency:</strong>
            Every ${item.frequencyDays} days
          </p>

          <p style="margin:15px 0 0;">
            <a href="${plantation.googleMapLink}"
              style="color:#2e7d32; text-decoration:none; font-weight:bold;">
              📍 Open Location in Google Maps →
            </a>
          </p>

        </td>
      </tr>

    </table>
  `;
    })
    .join("");

  return `<table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0"
  style="background-color:#f4f8f3; padding:25px 10px; font-family:Arial,Helvetica,sans-serif;">

  <tr>
    <td align="center">

      <table width="650" cellpadding="0" cellspacing="0" border="0"
        style="max-width:650px; width:100%; background-color:#ffffff; border-radius:10px;">

        <!-- Header -->
        <tr>
          <td style="padding:25px 30px; background-color:#2e7d32; color:#ffffff;">

            <h2 style="margin:0 0 8px; font-size:24px;">
              🌱 Daily Watering Reminder
            </h2>

            <p style="margin:0; font-size:14px;">
              Watering locations scheduled for today
            </p>

          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:25px 30px; color:#333333;">

            <p style="font-size:15px; line-height:1.6; margin:0 0 20px;">
              Please review today's watering locations and ensure the
              required watering tasks are completed on time.
            </p>

            <!-- Locations list -->
            ${locationsListHtml}

            <p style="font-size:14px; line-height:1.6; color:#666666; margin:20px 0 0;">
              Thank you for helping us keep our plantations healthy and
              growing. 🌱
            </p>

            <p style="font-size:15px; margin:15px 0 0;">
              <strong style="color:#2e7d32;">
                Green Army Charitable Trust
              </strong>
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center"
            style="background-color:#f1f1f1; padding:15px; color:#777777; font-size:12px;">

            🌳 Plant Today. Protect Tomorrow.

          </td>
        </tr>

      </table>

    </td>
  </tr>

</table>`;
};
