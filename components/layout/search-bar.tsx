"use client";

import { useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDraggable } from "@heroui/modal";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <>
      <Button onPress={() => setIsOpen(true)} isIconOnly aria-label="搜索" color="default" variant="light">
        <Search />
      </Button>

      <Modal isOpen={isOpen} size={"4xl"} onClose={onClose} backdrop="blur" placement="top">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">搜索</ModalHeader>
              <ModalBody>
                <Input type="text" placeholder="请输入搜索内容" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
                  确认
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
