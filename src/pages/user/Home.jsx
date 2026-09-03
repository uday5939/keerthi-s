import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../../services/supabase";

import Navbar from "../../components/user/Navbar";
import Hero from "../../components/user/Hero";
import Story from "../../components/user/Story";
import PickleCollection from "../../components/user/PickleCollection";
import PickleList from "../../components/user/PickleList";
import OurKitchen from "../../components/user/OurKitchen";
import Footer from "../../components/user/Footer";

import "./Home.css";

function Home() {
  // ==================================================
  // BUSINESS
  // ==================================================

  const [business, setBusiness] =
    useState(null);

  // ==================================================
  // PICKLES
  // ==================================================

  const [pickles, setPickles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ==================================================
  // CATEGORY
  // ==================================================

  const [category, setCategory] =
    useState("All");

  // ==================================================
  // ORDER LIST
  // ==================================================

  const [orderList, setOrderList] =
    useState([]);

  const [isOrderOpen, setIsOrderOpen] =
    useState(false);

  // ==================================================
  // CUSTOMER
  // ==================================================

  const [customer, setCustomer] =
    useState({
      name: "",
      phone: "",
      address: "",
    });

  // ==================================================
  // LOAD DATA
  // ==================================================

  useEffect(() => {
    loadHomeData();
  }, []);

  async function loadHomeData() {
    setLoading(true);

    try {
      // ==================================================
      // LOAD BUSINESS
      // ==================================================

      const businessPromise =
        supabase
          .from("business_details")
          .select("*")
          .limit(1)
          .maybeSingle();

      // ==================================================
      // LOAD PICKLES
      // ==================================================

      const picklesPromise =
        supabase
          .from("pickles")
          .select("*")
          .eq("is_active", true)
          .order(
            "display_order",
            {
              ascending: true,
            }
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      const [
        businessResponse,
        picklesResponse,
      ] = await Promise.all([
        businessPromise,
        picklesPromise,
      ]);

      // ==================================================
      // BUSINESS
      // ==================================================

      if (
        businessResponse.error
      ) {
        console.error(
          "Business error:",
          businessResponse.error
        );
      }

      setBusiness(
        businessResponse.data ||
          null
      );

      // ==================================================
      // PICKLES
      // ==================================================

      if (
        picklesResponse.error
      ) {
        console.error(
          "Pickles error:",
          picklesResponse.error
        );

        setPickles([]);

      } else {
        console.log(
          "Pickles received:",
          picklesResponse.data
        );

        setPickles(
          picklesResponse.data ||
            []
        );
      }

    } catch (error) {
      console.error(
        "Error loading home:",
        error
      );

      setBusiness(null);
      setPickles([]);

    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // FILTER
  // ==================================================

  const filteredPickles =
    useMemo(() => {
      if (
        category === "All"
      ) {
        return pickles;
      }

      return pickles.filter(
        (pickle) =>
          pickle.category ===
          category
      );
    }, [
      pickles,
      category,
    ]);

  // ==================================================
  // OPEN ORDER
  // ==================================================

  function openOrder(
    pickle = null,
    selectedPortion = null
  ) {
    if (
      pickle &&
      selectedPortion
    ) {
      addToOrderList(
        pickle,
        selectedPortion
      );

      return;
    }

    setIsOrderOpen(true);
  }

  // ==================================================
  // CLOSE ORDER
  // ==================================================

  function closeOrder() {
    setIsOrderOpen(false);
  }

  // ==================================================
  // ADD PRODUCT
  // ==================================================

  function addToOrderList(
    pickle,
    selectedPortion
  ) {
    if (!pickle) {
      return;
    }

    if (!selectedPortion) {
      alert(
        "Please select a portion first."
      );

      return;
    }

    const portion =
      String(
        selectedPortion.portion ||
          ""
      ).trim();

    const price =
      Number(
        selectedPortion.price
      );

    if (!portion) {
      alert(
        "Please select a portion."
      );

      return;
    }

    if (
      !Number.isFinite(price)
    ) {
      alert(
        "Invalid price for this portion."
      );

      return;
    }

    // ==================================================
    // CHECK EXISTING
    // ==================================================

    const existing =
      orderList.find(
        (item) =>
          String(
            item.pickleId
          ) ===
            String(
              pickle.id
            ) &&
          item.unit ===
            portion
      );

    // ==================================================
    // EXISTING
    // ==================================================

    if (existing) {
      setOrderList(
        (current) =>
          current.map(
            (item) =>
              String(
                item.pickleId
              ) ===
                String(
                  pickle.id
                ) &&
              item.unit ===
                portion
                ? {
                    ...item,

                    quantity:
                      item.quantity +
                      1,
                  }
                : item
          )
      );
    }

    // ==================================================
    // NEW
    // ==================================================

    else {
      setOrderList(
        (current) => [
          ...current,

          {
            id:
              `${pickle.id}-${portion}-${Date.now()}`,

            pickleId:
              pickle.id,

            name:
              pickle.name,

            category:
              pickle.category,

            description:
              pickle.description,

            image_url:
              pickle.image_url,

            unit:
              portion,

            price:
              price,

            quantity: 1,
          },
        ]
      );
    }

    setIsOrderOpen(true);
  }

  // ==================================================
  // REMOVE
  // ==================================================

  function removeFromOrderList(
    id
  ) {
    setOrderList(
      (current) =>
        current.filter(
          (item) =>
            item.id !== id
        )
    );
  }

  // ==================================================
  // INCREASE
  // ==================================================

  function increaseQuantity(
    id
  ) {
    setOrderList(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,

                  quantity:
                    item.quantity +
                    1,
                }
              : item
        )
    );
  }

  // ==================================================
  // DECREASE
  // ==================================================

  function decreaseQuantity(
    id
  ) {
    setOrderList(
      (current) =>
        current
          .map(
            (item) =>
              item.id === id
                ? {
                    ...item,

                    quantity:
                      item.quantity -
                      1,
                  }
                : item
          )
          .filter(
            (item) =>
              item.quantity >
              0
          )
    );
  }

  // ==================================================
  // CUSTOMER
  // ==================================================

  function updateCustomer(
    field,
    value
  ) {
    setCustomer(
      (current) => ({
        ...current,

        [field]:
          value,
      })
    );
  }

  // ==================================================
  // VALIDATE CUSTOMER
  // ==================================================

  function validateCustomer() {
    if (
      !customer.name.trim()
    ) {
      alert(
        "Please enter your name."
      );

      return false;
    }

    if (
      !customer.phone.trim()
    ) {
      alert(
        "Please enter your phone number."
      );

      return false;
    }

    if (
      !customer.address.trim()
    ) {
      alert(
        "Please enter your delivery address."
      );

      return false;
    }

    return true;
  }

  // ==================================================
  // SCROLL COLLECTION
  // ==================================================

  function scrollToCollection() {
    document
      .getElementById(
        "pickles"
      )
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  // ==================================================
  // SCROLL KITCHEN
  // ==================================================

  function scrollToKitchen() {
    document
      .getElementById(
        "our-kitchen"
      )
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }

  // ==================================================
  // WHATSAPP
  // ==================================================

  function sendWhatsApp() {
    if (
      orderList.length === 0
    ) {
      alert(
        "Please select at least one item."
      );

      return;
    }

    if (
      !validateCustomer()
    ) {
      return;
    }

    const whatsappNumber =
      business?.whatsapp ||
      business?.phone;

    if (!whatsappNumber) {
      alert(
        "WhatsApp number has not been configured yet."
      );

      return;
    }

    let cleanNumber =
      String(
        whatsappNumber
      ).replace(
        /\D/g,
        ""
      );

    if (
      cleanNumber.length === 10
    ) {
      cleanNumber =
        `91${cleanNumber}`;
    }

    const lines = [];

    lines.push(
      "Hello Keerthi's Pickles!"
    );

    lines.push("");

    lines.push(
      "I would like to place an order:"
    );

    lines.push("");

    orderList.forEach(
      (item, index) => {
        const itemTotal =
          Number(
            item.price || 0
          ) *
          Number(
            item.quantity || 0
          );

        lines.push(
          `${index + 1}. ${item.name} - ${item.unit} x ${item.quantity} - ₹${itemTotal.toFixed(
            2
          )}`
        );
      }
    );

    const total =
      orderList.reduce(
        (sum, item) =>
          sum +
          Number(
            item.price || 0
          ) *
            Number(
              item.quantity || 0
            ),
        0
      );

    lines.push("");

    lines.push(
      `Estimated Total: ₹${total.toFixed(
        2
      )}`
    );

    lines.push("");

    lines.push(
      `Name: ${customer.name.trim()}`
    );

    lines.push(
      `Phone: ${customer.phone.trim()}`
    );

    lines.push(
      `Address: ${customer.address.trim()}`
    );

    lines.push("");

    lines.push(
      "Please confirm availability, final price and delivery details."
    );

    const message =
      encodeURIComponent(
        lines.join("\n")
      );

    const url =
      `https://wa.me/${cleanNumber}?text=${message}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  // ==================================================
  // CALL
  // ==================================================

  function preferToCall() {
    if (
      orderList.length === 0
    ) {
      alert(
        "Please select at least one item."
      );

      return;
    }

    if (
      !validateCustomer()
    ) {
      return;
    }

    const phone =
      business?.phone ||
      business?.whatsapp;

    if (!phone) {
      alert(
        "Phone number has not been configured yet."
      );

      return;
    }

    window.location.href =
      `tel:${phone}`;
  }

  // ==================================================
  // ORDER COUNT
  // ==================================================

  const orderCount =
    orderList.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="home-page">

      <Navbar
        business={business}
        orderCount={
          orderCount
        }
        onOpenOrder={
          openOrder
        }
        onScrollToKitchen={
          scrollToKitchen
        }
        onScrollToCollection={
          scrollToCollection
        }
      />

      <Hero
        business={business}
        onExplore={
          scrollToCollection
        }
        onOrder={
          openOrder
        }
        onKitchen={
          scrollToKitchen
        }
      />

      <Story
        business={business}
        onExplore={
          scrollToCollection
        }
      />

      <PickleCollection
        pickles={
          filteredPickles
        }
        allPickles={
          pickles
        }
        activeCategory={
          category
        }
        setActiveCategory={
          setCategory
        }
        onOrder={
          openOrder
        }
        loading={
          loading
        }
      />

      {/* ==================================================
          OUR KITCHEN
          ================================================== */}

      <OurKitchen />

      <PickleList
        isOpen={
          isOrderOpen
        }
        items={
          orderList
        }
        allPickles={
          pickles
        }
        customer={
          customer
        }
        onCustomerChange={
          updateCustomer
        }
        onIncrease={
          increaseQuantity
        }
        onDecrease={
          decreaseQuantity
        }
        onRemove={
          removeFromOrderList
        }
        onAddToList={
          addToOrderList
        }
        onSendWhatsApp={
          sendWhatsApp
        }
        onPreferToCall={
          preferToCall
        }
        onClose={
          closeOrder
        }
      />

      <Footer
        business={
          business
        }
        onExplore={
          scrollToCollection
        }
        onOrder={
          openOrder
        }
      />

    </div>
  );
}

export default Home;