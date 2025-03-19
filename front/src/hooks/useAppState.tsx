import { useState } from 'react';
import { FundedEvent, DealEvent } from "../lib/type";

export function useAppState() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);
    const [products, setProducts] = useState<FundedEvent[]>([]);
    const [dealState, setDealState] = useState<DealEvent[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<{ productID: string; quantity: string; price: string } | null>(null);
    const [showRatingInput, setShowRatingInput] = useState<boolean>(false);
    const [dealId, setDealId] = useState<string>('');
    const [productId, setProductId] = useState<string>('');
    const [inputValueRating, setInputValueRating] = useState<string>('');
    const [ratingEvents, setRatingEvents] = useState<{ productId: string; rating: string; ratingCount: string }[]>([]);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [signatureData, setSignatureData] = useState<{
        msgHash: string;
        r: string;
        s: string;
        v: number;
    } | null>(null);
    const [submittedData, setSubmittedData] = useState<{
        dealId: string;
        productId: string;
        rating: string;
        address: string;
        msgHash: string;
        r: string;
        s: string;
        v: number;
        comment: string;
        images: File[];
    } | null>(null);

    return {
        isLoading, setIsLoading,
        isSuccess, setIsSuccess,
        showSignUpForm, setShowSignUpForm,
        products, setProducts,
        dealState, setDealState,
        selectedProduct, setSelectedProduct,
        showRatingInput, setShowRatingInput,
        dealId, setDealId,
        productId, setProductId,
        inputValueRating, setInputValueRating,
        ratingEvents, setRatingEvents,
        signatureData, setSignatureData,
        submittedData, setSubmittedData,
        comment, setComment,
        images, setImages
    };
}